import { LocationGateway } from '../location.gateway';

describe('LocationGateway', () => {
  let gateway: LocationGateway;

  beforeEach(() => {
    gateway = new LocationGateway();
  });

  it('handleConnection joins room when vehicleId provided', async () => {
    const client: any = {
      id: 'c1',
      handshake: { query: { vehicleId: 'veh1' } },
      join: jest.fn().mockResolvedValue(undefined),
    };
    const debugSpy = jest
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .spyOn((gateway as any).logger, 'debug')
      .mockImplementation(() => undefined);
    await gateway.handleConnection(client);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(client.join).toHaveBeenCalledWith('vehicle:veh1');
    expect(debugSpy).toHaveBeenCalled();
  });

  it('handleConnection does nothing when no vehicleId', async () => {
    const client: any = {
      id: 'c2',
      handshake: { query: {} },
      join: jest.fn(),
    };
    await gateway.handleConnection(client);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(client.join).not.toHaveBeenCalled();
  });

  it('handleJoinVehicle joins specified room', async () => {
    const client: any = {
      id: 'c3',
      join: jest.fn().mockResolvedValue(undefined),
    };
    const debugSpy = jest
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .spyOn((gateway as any).logger, 'debug')
      .mockImplementation(() => undefined);
    await gateway.handleJoinVehicle(client, 'veh2');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(client.join).toHaveBeenCalledWith('vehicle:veh2');
    expect(debugSpy).toHaveBeenCalled();
  });

  it('broadcastLocation emits to vehicle room', () => {
    const emit = jest.fn();
    const to = jest.fn().mockReturnValue({ emit });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (gateway as any).server = { to };
    const location: any = { id: 'loc1', vehicleId: 'veh9' };
    gateway.broadcastLocation(location);
    expect(to).toHaveBeenCalledWith('vehicle:veh9');
    expect(emit).toHaveBeenCalledWith('location-update', location);
  });

  it('handleDisconnect logs', () => {
    const debugSpy = jest
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .spyOn((gateway as any).logger, 'debug')
      .mockImplementation(() => undefined);
    gateway.handleDisconnect({ id: 'disc1' } as any);
    expect(debugSpy).toHaveBeenCalled();
  });
});
