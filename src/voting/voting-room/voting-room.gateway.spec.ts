import { Test, TestingModule } from "@nestjs/testing";
import { VotingRoomGateway } from "./voting-room.gateway";

describe("VotingGateway", () => {
    let gateway: VotingRoomGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VotingRoomGateway],
        }).compile();

        gateway = module.get<VotingRoomGateway>(VotingRoomGateway);
    });

    it("should be defined", () => {
        expect(gateway).toBeDefined();
    });
});
