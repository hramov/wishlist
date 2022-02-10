import Server from './index';

describe("Test server is really singleton", () => {
    const server1 = new Server(8000);
    const server2 = new Server(8001);

    expect(
        server1
    ).not.toBe(server2);
})