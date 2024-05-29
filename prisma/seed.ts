import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const logger = new Logger('PrismaSeedScript');

const hashPassword = async (password: string) => {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const getRoles = async () => {
    return [
        { name: 'Admin' },
        { name: 'User' }
    ];
}

const getPermissions = async (role: 'Admin' | 'User') => {
    let roles = [{ name: 'blog:read' }];

    if (role == 'Admin') {
        roles = [
            { name: 'blog:read' },
            { name: 'blog:create' },
            { name: 'blog:update' },
            { name: 'blog:delete' }
        ];
    }

    return roles;
}

const filterCreatedPermissions = async (permissions: Array<{ name: string }>) => {
    return {
        where: {
            name: { in: permissions.map((permission) => permission.name) }
        }
    };
}

const createRolesAndPermissions = async (transaction) => {
    const roles = await getRoles();
    const adminPermissions = await getPermissions('Admin');
    const userPermissions = await getPermissions('User');

    await transaction.role.createMany({ data: roles });
    await transaction.permissions.createMany({ data: adminPermissions });

    const adminRole = await transaction.role.findFirst({ where: { name: 'Admin' } });
    const userRole = await transaction.role.findFirst({ where: { name: 'User' } });

    const createdAdminPermissions = await transaction.permissions.findMany(await filterCreatedPermissions(adminPermissions));
    const createdUserPermissions = await transaction.permissions.findMany(await filterCreatedPermissions(userPermissions));

    for (const permission of createdAdminPermissions) {
        await transaction.rolesOnPermissions.create({
            data: {
                roleId: adminRole.id,
                permissionsId: permission.id
            }
        });
    }

    for (const permission of createdUserPermissions) {
        await transaction.rolesOnPermissions.create({
            data: {
                roleId: userRole.id,
                permissionsId: permission.id
            }
        });
    }
}

const getDefaultUser = async (roleId: number) => {
    const hashedPassword = await hashPassword('password');

    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: 'john.doe@gmail.com',
        mobileNumber: '09172838293',
        password: hashedPassword,
        emailVerifiedAt: new Date().toISOString(),
        roleId
    };
}

const getUsers = async (roleId: number) => {
    const hashedPassword = await hashPassword('password');

    const users = []
    for (let index = 0; index < 5; index++) {
        users.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            mobileNumber: '09' + faker.string.numeric({ length: 9 }),
            password: hashedPassword,
            emailVerifiedAt: new Date().toISOString(),
            roleId
        });

    }

    return users;
}

const createAdminUser = async (transaction) => {
    const adminRole = await transaction.role.findFirst({ where: { name: 'Admin' } });

    const defaultUser = await getDefaultUser(adminRole.id);

    await transaction.user.create({ data: defaultUser });

    logger.log('Default admin user has been created.');
}

const createNonAdminUsers = async (transaction) => {
    const userRole = await transaction.role.findFirst({ where: { name: 'User' } });

    const users = await getUsers(userRole.id);

    await transaction.user.createMany({  data: users });

    logger.log('Non-admin users have been created.');
}

const main = async () => {
    await prisma.$transaction(async (transaction) => {
        await createRolesAndPermissions(transaction);
        await createAdminUser(transaction);
        await createNonAdminUsers(transaction);
    });
}

main()
    .then(() => {
        logger.log('Database has finished seeding.');
    })
    .catch((error) => {
        logger.error('Seeding has encountered an error: ' + error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
