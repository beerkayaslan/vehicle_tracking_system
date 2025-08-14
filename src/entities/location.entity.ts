import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.locations)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column('int')
  speed: number;

  @CreateDateColumn()
  timestamp: Date;
}
