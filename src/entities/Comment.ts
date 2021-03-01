import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import RootEntity from "./RootEntity";
import Post from "./Post";
import User from "./User";

import { makeId } from "../util/helpers";
import Vote from "./Vote";
import { Exclude } from "class-transformer";

@Entity("comments")
export default class Comment extends RootEntity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, post => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, vote => vote.comment)
  votes: Vote[];

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(v => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
