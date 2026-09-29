import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category, Prisma, PrismaService, Product } from '@org/database';
import { CreateProductType, ProductResponseType, QueryProductType, UpdateProductType } from '@org/schemas';

@Injectable()
export class ProductsService {
    /**
     *
     */
    constructor(private readonly prisma:PrismaService) {}

    async create(createProduct:CreateProductType):Promise<ProductResponseType>{
        
        const existingSku = await this.prisma.client.product.findUnique({
            where: { sku: createProduct.sku}
        })

        if(existingSku){
            throw new ConflictException(`Product with Sku ${createProduct.sku} already exists`)
        }

        const product = await this.prisma.client.product.create({
            data: {
                ...createProduct,
                price: createProduct.price
            },
            include: {
                category: true
            }
        })


        return this.formatProduct(product)
    }

    async findAll(queryProduct:QueryProductType):Promise<{
        data:ProductResponseType[],
        meta: {total: number, page: number, limit: number, totalPage: number }
    }>{
        const { category, isActive, search, page= 1, limit= 10 } = queryProduct

        const where: Prisma.ProductWhereInput = {}

        if(category){
            where.categoryId = category
        }

        if(isActive !== undefined){
            where.isActive = isActive
        }

        if(search){
            where.OR = [
                { name: { contains: search, mode: 'insensitive' }},
                { description: { contains: search, mode: 'insensitive' }}
            ]
        }

        const total = await this.prisma.client.product.count({where})

        const products = await this.prisma.client.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true
            }
        })

        return {
            data: products.map((product) => this.formatProduct(product)),
            meta: {
                total,
                page,
                limit,
                totalPage: Math.ceil((total) / limit)
            }
        }

    }


    async findOne(id: string):Promise<ProductResponseType>{
        const product = await this.prisma.client.product.findUnique({
            where: {id},
            include: {
                category: true
            }
        })

        if(!product){
            throw new NotFoundException('product not found')
        }

        return this.formatProduct(product)
    }

    async update(id: string, updateProductDto:UpdateProductType):Promise<ProductResponseType>{
        const existingProduct = await this.prisma.client.product.findUnique({
            where: { id }
        })

        if (!existingProduct) {
            throw new NotFoundException('product not found')
        }

        if(updateProductDto.sku && updateProductDto.sku !== existingProduct.sku){
            const skuToken = await this.prisma.client.product.findUnique({
                where: { sku: updateProductDto.sku}
            })

            if (skuToken) {
                throw new ConflictException('Product sku with already exists')
            }
        }


        const updateData: Prisma.ProductUpdateInput = { ...updateProductDto }

        if (updateProductDto.price !== undefined) {
            updateData.price = new Prisma.Decimal(updateProductDto.price)
        }

        const updateProduct = await this.prisma.client.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        })

        return this.formatProduct(updateProduct)
    }

    async updateStock(id: string, quantity: number):Promise<ProductResponseType>{
        const product = await this.prisma.client.product.findUnique({
            where: { id }
        })

        if(!product){
            throw new NotFoundException('product not found')
        }

        const newStock = product.stock + quantity

        if(newStock < 0){
            throw new BadRequestException('Insufficient stock')
        }

        const updateProduct = await this.prisma.client.product.update({
            where: { id },
            data: { stock: newStock },
            include: {
                category: true
            }
        })

        return this.formatProduct(updateProduct)
    }

    async remove(id: string):Promise<{ message: string}>{
        const product = await this.prisma.client.product.findUnique({
            where: { id },
            include: {
                orderItems: true,
                cartItems: true
            }
        })

        if(!product){
            throw new NotFoundException('Product not found')
        }

        if(product.orderItems.length > 0){
            throw new BadRequestException('Cannot delete product that is part of existing orders. Consider marking it as inactive only')
        }

        await this.prisma.client.product.delete({
            where: { id }
        })

        return { message: 'Product deleted successfully'}
    }

    private formatProduct(product:Product & { category: Category }):ProductResponseType{
        return {
            ...product,
            price: Number(product.price),
            category: product.category.name,
        }
    }

    
}
