import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsLogin(validationOption?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            name: 'IsLogin',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOption,
            validator: {
                validate(value: any): boolean {
                    return /^[A-Z]+\w{2,}$/i.test(value);
                },
            },
        });
    };
}
