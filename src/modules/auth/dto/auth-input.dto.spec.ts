import { validateSync } from 'class-validator';
import { AuthInputDto } from './auth-input.dto';


describe('AuthInputDto', () => {
    let authInputDto: AuthInputDto;

    const validLoginValues = [
        'Scrummarly',
        'SM444',
        'SM7',
        'G13',
        'G123',
        'g123',
        'Tester',
        'john',
        'john15',
        'Chuck',
    ];

    const invalidLoginValues = [
        '13testtest',
        '!@23',
        '$23',
        '^23',
        '&I nnim',
        'jo',
        '$99<.',
        '_&',
        '123',
    ];

    beforeEach(() => {
        authInputDto = new AuthInputDto();
    });

    describe('Check login validation', () => {
        test.each(validLoginValues)('should return empty errors array on valid login values', (loginValue) => {
            authInputDto.userName = loginValue;
            const errors = validateSync(authInputDto);
            expect(errors.length).toEqual(0);
        });

        test.each(invalidLoginValues)('should return filled errors array on invalid login values',
            (loginValue) => {
                authInputDto.userName = loginValue;
                const errors = validateSync(authInputDto);
                expect(errors.length).toEqual(1);
            });
    });
});
