import { SegmentClient } from '../../analytics';
import { getMockLogger } from '../__helpers__/mockLogger';
import { mockPersistor } from '../__helpers__/mockPersistor';

jest.mock('../../uuid', () => ({
  getUUID: () => 'mocked-uuid',
}));

const defaultClientSettings = {
  logger: getMockLogger(),
  store: {
    dispatch: jest.fn() as jest.MockedFunction<any>,
    getState: () => ({
      userInfo: {
        userId: 'current-user-id',
        anonymousId: 'very-anonymous',
      },
    }),
  },
  config: {
    writeKey: 'mock-write-key',
  },
  persistor: mockPersistor,
  actions: {},
};

describe('methods #group', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValueOnce('2010-01-01T00:00:00.000Z');
  });

  it('adds the alias event correctly', () => {
    const client = new SegmentClient(defaultClientSettings);
    jest.spyOn(client, 'process');

    client.group('new-group-id', { name: 'Best Group Ever' });

    const expectedEvent = {
      groupId: 'new-group-id',
      type: 'group',
      traits: {
        name: 'Best Group Ever',
      },
    };

    expect(client.process).toHaveBeenCalledTimes(1);
    expect(client.process).toHaveBeenCalledWith(expectedEvent);

    expect(client.logger.info).toHaveBeenCalledTimes(1);
    expect(client.logger.info).toHaveBeenCalledWith(
      'GROUP event saved',
      expectedEvent
    );
  });
});