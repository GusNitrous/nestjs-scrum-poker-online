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
                    return value && /^[A-Z]+[\w-_.]{3,}\w$/i.test(value);
                },
                defaultMessage(): string {
                    return 'Invalid login value';
                },
            },
        });
    };
}
