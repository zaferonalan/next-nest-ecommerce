import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderItem, OrderStatus, Prisma, PrismaService, Product, User } from '@org/database';
import { CreateOrdersType, OrderApiResponseType, OrderResponseType, PaginationOrderType, QueryOrderType, UpdateOrderType } from '@org/schemas';

type OrderWithRelations = Order & {
    orderItems: (OrderItem & { product: Product })[];
    user: User;
};

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, createOrder: CreateOrdersType): Promise<OrderApiResponseType> {
        const { items, shippingAdress } = createOrder;

        // Aynı ürün birden fazla satırda gelirse miktarları birleştir
        const quantityByProduct = new Map<string, number>();
        for (const item of items) {
            quantityByProduct.set(
                item.productId,
                (quantityByProduct.get(item.productId) ?? 0) + item.quantity,
            );
        }
        const productIds = [...quantityByProduct.keys()];

        // Ürünleri tek sorguda getir
        const products = await this.prisma.client.product.findMany({
            where: { id: { in: productIds } },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));

        // Ürün varlığı ve ön stok kontrolü (hızlı hata için; asıl koruma transaction içinde)
        for (const [productId, quantity] of quantityByProduct) {
            const product = productMap.get(productId);
            if (!product) {
                throw new NotFoundException(`Product with Id ${productId} not found`);
            }
            if (product.stock < quantity) {
                throw new BadRequestException(
                    `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`,
                );
            }
        }

        const orderItemsData = productIds.map((productId) => ({
            productId,
            quantity: quantityByProduct.get(productId)!,
            price: productMap.get(productId)!.price,
        }));

        const total = orderItemsData.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity,
            0,
        );

        const order = await this.prisma.client.$transaction(async (tx) => {
            // Stok kontrolü ve düşümü atomik: yeterli stok yoksa count 0 döner
            for (const item of orderItemsData) {
                const result = await tx.product.updateMany({
                    where: { id: item.productId, stock: { gte: item.quantity } },
                    data: { stock: { decrement: item.quantity } },
                });

                if (result.count === 0) {
                    const name = productMap.get(item.productId)!.name;
                    throw new BadRequestException(`Insufficient stock for product ${name}`);
                }
            }

            const latestCart = await tx.cart.findFirst({
                where: { userId, checkedOut: false },
                orderBy: { createdAt: 'desc' },
            });

            const newOrder = await tx.order.create({
                data: {
                    userId,
                    status: OrderStatus.PENDING,
                    totalAmount: total,
                    shippingAddress: shippingAdress, // modeldeki alan adı shippingAddress
                    cartId: latestCart?.id,
                    orderItems: {
                        create: orderItemsData,
                    },
                },
                include: {
                    orderItems: { include: { product: true } },
                    user: true,
                },
            });

            // Sepeti kapat
            if (latestCart) {
                await tx.cart.update({
                    where: { id: latestCart.id },
                    data: { checkedOut: true },
                });
            }

            return newOrder;
        });

        return this.wrap(order);
    }

    async findAllForAdmin(query:QueryOrderType):Promise<PaginationOrderType>{

        const { limit = 10, page = 1, status, search} = query

        const skip = (page - 1) * limit

        const where:Prisma.OrderWhereInput = {}

        if(status) where.status = status
        if(search) where.OR = [
            {id: {contains: search, mode: 'insensitive'}}, 
            {orderNumber: {contains: search, mode: 'insensitive'}}
        ]

        const [orders, total] = await Promise.all([
            this.prisma.client.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    user: true
                },
                orderBy: {createdAt: 'desc'}
            }),

            this.prisma.client.order.count({ where })
        ])

        return {
            success: true,
            message: 'Orders fetched successfully',
            data: {
                items: orders.map((o) => this.map(o)),
                page,
                limit,
                total,
            }
        }
    }

    async findAll(userId: string, query:QueryOrderType):Promise<PaginationOrderType>{
        
        const { limit = 10, page = 1, search, status } = query

        const skip = (page - 1) * limit
        
        const where :Prisma.OrderWhereInput = { userId }

        if (status) where.status = status
        if (search) where.OR = [{id: {contains: search,  mode: 'insensitive'}}]

        const [orders, total] = await Promise.all([
            this.prisma.client.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.client.order.count({
                where
            })
        ])

        return {
            success: true,
            message: '',
            data: {
                items: orders.map((o) => this.map(o)),
                limit,
                page,
                total
            }

        }
    }

    async findOneAdmin( id: string,): Promise<OrderApiResponseType> {
        const order = await this.prisma.client.order.findUnique({
            where: { id },
            include: {
            orderItems: { include: { product: true } },
            user: true,
            },
        });

        if (!order) throw new NotFoundException('Order not found')

        return this.wrap(order);
    }


    async findOne(id:string, userId: string):Promise<OrderApiResponseType>{

        const order = await this.prisma.client.order.findFirst({
            where: { id, userId },
            include: {
            orderItems: { include: { product: true } },
            user: true,
            },
        });

        if(!order) throw new NotFoundException('Order not found')

        return this.wrap(order);
    }


    async updateAdmin(id:string, updateOrder:UpdateOrderType):Promise<OrderApiResponseType>{
        const existing = await this.prisma.client.order.findUnique({
            where: {id}
        })

        if(!existing) throw new NotFoundException(`Order ${id} not found`)

        const update = await this.prisma.client.order.update({
            where: {id},
            data: updateOrder,
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        })

        return this.wrap(update)
    }


    async update(id: string, updateDto:UpdateOrderType, userId: string):Promise<OrderApiResponseType>{
        const existing = await this.prisma.client.order.findUnique({
            where: {userId, id}
        })

        if(!existing?.id) throw new NotFoundException(`Order ${id} not found`)
        if(!existing.userId) throw new ForbiddenException('unauthorized access')
        
        const update = await this.prisma.client.order.update({
            where: { id, userId },
            data: updateDto,
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        })

        return this.wrap(update)
    }


    async cancelledAdmin(id: string):Promise<OrderApiResponseType>{
        return this.prisma.client.$transaction( async (tx) => {

            const result = await tx.order.updateMany({
                where: {
                    id,
                    status: OrderStatus.PENDING
                },
                data: {
                    status: OrderStatus.CANCELLED
                }
            })

            if(result.count === 0) {
                const orderExists = await tx.order.findUnique({
                    where: { id },
                    select: { id: true }
                })

                if(!orderExists) throw new NotFoundException(`Order ${id} not found`)
                
                throw new BadRequestException("Only pending orders can be canceled")
            }

            const order = await tx.order.findUniqueOrThrow({
                where: { id },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    user: true
                }
            })

            const quantityByProduct = new Map<string, number>()

            for (const item of order.orderItems) {
                
                quantityByProduct.set(item.productId, (quantityByProduct.get(item.productId) ?? 0 ) + item.quantity)
            }

            for (const [productId, quantity] of quantityByProduct) {
                await tx.product.update({
                    where: {id: productId},
                    data: {
                        stock: { increment: quantity }
                    }
                })
            }

            return this.wrap(order)
        })
    }


    async cancelled(id: string, userId: string):Promise<OrderApiResponseType>{

        return this.prisma.client.$transaction( async (tx) => {

            const result = await tx.order.updateMany({
                where: { id, userId, status: OrderStatus.PENDING },
                data: {
                    status: OrderStatus.CANCELLED
                }
            })

            if(result.count === 0) {

                const orderExist = await tx.order.findFirst({
                    where: { id, userId },
                    select: { id: true }
                })

                if(!orderExist) {
                    throw new NotFoundException('Order not found')
                }

                throw new BadRequestException('Only pending orders can be canceled')
            }

            const order = await tx.order.findUniqueOrThrow({
                where: { id, userId },
                include: {
                    orderItems: {
                        include: { product: true }
                    },
                    user: true
                }
            })

            const quantityByProduct = new Map<string, number>()

            for (const item of order.orderItems) {
                quantityByProduct.set( item.productId, 
                    (quantityByProduct.get(item.productId) ?? 0 ) + item.quantity )
            }


            for (const [productId, quantity] of quantityByProduct) {
                await tx.product.update({
                    where: {id: productId},
                    data: {
                        stock: { increment: quantity}
                    }
                })
            }

            return this.wrap(order)

        })
    }




    private wrap(order: OrderWithRelations): OrderApiResponseType {
        return {
            success: true,
            message: 'Order created successfully',
            data: this.map(order),
        };
    }

    private map(order: OrderWithRelations): OrderResponseType {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            total: Number(order.totalAmount),
            shippingAdress: order.shippingAddress ?? '',
            items: order.orderItems.map((item) => ({
                id: item.id,
                productId: item.productId,
                productName: item.product.name,
                quantity: item.quantity,
                price: Number(item.price),
                subtotal: Number(item.price) * item.quantity,
                createdAt: item.createdAt.toISOString(),
                updatedAt: item.updatedAt.toISOString(),
            })),
            userEmail: order.user.email,
            userName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
        };
    }
}