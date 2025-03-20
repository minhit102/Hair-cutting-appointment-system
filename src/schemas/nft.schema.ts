import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NFTDocument = NFT & Document;

@Schema()
export class NFT {
  @Prop({ required: true })
  floorPrice: number;

  @Prop({ required: true })
  marketCap: number;

  @Prop({ required: true })
  volume24h: number;

  @Prop({ required: true })
  holders: number;

  @Prop({ required: true })
  uaw: number;
}

export const NFTSchema = SchemaFactory.createForClass(NFT);
