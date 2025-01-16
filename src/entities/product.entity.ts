import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';

@Index(['name', 'categoryId'])
@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'tinyint' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.Products)
  Category: Category;

  @Column({ name: 'price', type: 'numeric' })
  price: number;

  @Column()
  image: string;

  @Column({ name: 'in_stock', type: 'boolean', default: true })
  inStock: boolean;

  @Column({ type: 'float', default: 0 })
  ratings: number;

  @Column({ type: 'int', default: 0 })
  reviews: number;

  @Column({ length: '100', nullable: true })
  brand: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
