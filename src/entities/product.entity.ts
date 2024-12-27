import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'tinyint' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.id)
  Category: Category;

  @Column({ name: 'price', type: 'numeric' })
  price: number;

  @Column({ name: 'image' })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
