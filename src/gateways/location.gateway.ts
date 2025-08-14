import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Location } from '../entities/location.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(LocationGateway.name);

  private roomName(vehicleId: string): string {
    return `vehicle:${vehicleId}`;
  }

  async handleConnection(client: Socket): Promise<void> {
    const vehicleId = client.handshake.query.vehicleId as string | undefined;
    if (vehicleId) {
      await client.join(this.roomName(vehicleId));
      this.logger.debug(`Client ${client.id} joined vehicle room ${vehicleId}`);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-vehicle')
  async handleJoinVehicle(
    @ConnectedSocket() client: Socket,
    @MessageBody('vehicleId') vehicleId: string,
  ): Promise<void> {
    if (!vehicleId) return;
    await client.join(this.roomName(vehicleId));
    this.logger.debug(
      `Client ${client.id} joined via message vehicle ${vehicleId}`,
    );
  }

  broadcastLocation(location: Location): void {
    const room = this.roomName(location.vehicleId);
    this.server.to(room).emit('location-update', location);
  }
}
