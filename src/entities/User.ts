import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, BeforeInsert, OneToMany } from "typeorm";

import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import RootEntity from "./RootEntity";

import Post from "./Post";

@Entity("users")
export default class User extends RootEntity {
  /**
   * Creates a User
   * @param {User} user A user object
   */
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @Length(3, 255, { message: "Username should be at least 3 characters long" })
  @Column({ unique: true })
  username: string;

  @Length(6)
  @Exclude()
  @Column()
  password: string;

  @Index()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}