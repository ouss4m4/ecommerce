import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "description" })
  description: string;

  @Column({ name: "category" })
  category: string;

  @Column({ name: "price", type: "numeric" })
  price: number;

  @Column({ name: "image" })
  image: string;
}
