import { Test, TestingModule } from "@nestjs/testing";
import { VotingEventGateway } from "./voting-event.gateway";

describe("VotingEventGateway", () => {
    let gateway: VotingEventGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VotingEventGateway],
        }).compile();

        gateway = module.get<VotingEventGateway>(VotingEventGateway);
    });

    it("should be defined", () => {
        expect(gateway).toBeDefined();
    });
});
