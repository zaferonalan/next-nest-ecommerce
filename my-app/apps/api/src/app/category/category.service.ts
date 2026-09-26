import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category, Prisma, PrismaService } from '@org/database';
import { CategoryResponseType, CreateCategoryType, QueryCategoryType, UpdateCategoryType } from '@org/schemas';

@Injectable()
export class CategoryService {
    /**
     *
     */
    constructor(private readonly prisma:PrismaService) {}

    async create(createCategoryDto:CreateCategoryType):Promise<CategoryResponseType>{
        const { name, slug, ...rest } = createCategoryDto

        const categorySlug = slug ?? name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

        const existingCategory = await this.prisma.client.category.findUnique({
            where: {slug: categorySlug}
        })

        if(existingCategory){
            throw new ConflictException('Category with this slug already existing' + categorySlug)
        }

        const category = await this.prisma.client.category.create({
            data: {
                name,
                slug: categorySlug,
                ...rest
            }
        })

        return this.formatCategory(category, 0)
    }


    async findAll(queryDto:QueryCategoryType):Promise<{
        data:CategoryResponseType[];
        meta: {total: number, page:number, limit:number, totalPage:number}
    }>{
        const {isActive, search, page=1, limit=10} = queryDto

        const where:Prisma.CategoryWhereInput = {}

        if(isActive !== undefined){
            where.isActive = isActive
        }

        if(search){
            where.OR = [
                {
                    name: {contains: search, mode: 'insensitive'}
                },
                {
                    description: { contains: search, mode: 'insensitive'}
                }
            ]
        }

        const total = await this.prisma.client.category.count({where})

        const categories = await this.prisma.client.category.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {createdAt: 'desc'},
            include: {
                _count: {
                    select: {products: true}
                }
            }
        })

        return {
            data: categories.map((category) => this.formatCategory(category, category._count.products)),
            meta: {
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit)
            }
        }
    }

    async findOne(id: string):Promise<CategoryResponseType>{
        
        const category = await this.prisma.client.category.findUnique({
            where: {id},
            include: {
                _count: {
                    select: {products: true}
                }
            }
        })

        if(!category){
            throw new NotFoundException("Category not found")
        }

        return this.formatCategory(category, category._count.products)
    }

    async findBySlug(slug: string):Promise<CategoryResponseType> {

        const category = await this.prisma.client.category.findUnique({
            where: {slug},
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        })

        if(!category){
            throw new NotFoundException('Category not found')
        }

        return this.formatCategory(category, category._count.products)
    }



    async update(id: string, updatedto:UpdateCategoryType):Promise<CategoryResponseType>{

        const existingCategory = await this.prisma.client.category.findUnique({
            where: {id}
        })

        if(!existingCategory){
            throw new NotFoundException('Category not found')
        }

        if(updatedto.slug && updatedto.slug !== existingCategory.slug){
            
            const slugToken = await this.prisma.client.category.findUnique({
                where: {slug: updatedto.slug}
            })

            if (slugToken) {
                throw new ConflictException(`Category with slug ${updatedto.slug} already exists`)
            }
        }

        const updateCategory = await this.prisma.client.category.update({
            where: {id},
            data: updatedto,
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        })

        return this.formatCategory(updateCategory, updateCategory._count.products)
    }


    async remove(id: string):Promise<{message: string}>{

        const category = await this.prisma.client.category.findUnique({
            where: {id},
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        })

        if(!category){
            throw new NotFoundException('Category not found')
        }

        if(category._count.products > 0){
            throw new BadRequestException(`cannot delete category with ${category._count.products} products. Remove or reassing first`)
        }

        await this.prisma.client.category.delete({
            where: {id}
        })

        return { message: 'Category delete successfully'}
    }


    private formatCategory(category: Category, productCount:number):CategoryResponseType {
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            imageUrl: category.imageUrl,
            isActive: category.isActive,
            productCount,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString()
        }
    }
}
