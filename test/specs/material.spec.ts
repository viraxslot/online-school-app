import { SchemasV1 } from '../../src/api/v1/schemas';
import { MaterialRoute } from '../api/routes/material/material.route';
import { TestData } from '../helpers/test-data';

describe('API: material suite', function () {
    describe('GET: materials by course id', function () {
        it.todo('test');
    });

    describe('GET: material by id', function () {
        it.todo('test');
    });

    describe('POST: create material', function () {
        const validationTestCases = [
            {
                title: 'type of title field',
                field: 'title',
                value: 123,
                expectedMessage: 'Parameter should be a string',
            },
            {
                title: 'min length of title field',
                field: 'title',
                value: 'a'.repeat(SchemasV1.MaterialRequest.properties.title.minLength - 1),
                expectedMessage: 'Minimum material title length is: 3',
            },
            {
                title: 'max length of title field',
                field: 'title',
                value: 'a'.repeat(SchemasV1.MaterialRequest.properties.title.maxLength + 1),
                expectedMessage: 'Maximum material title length is: 100',
            },
            {
                title: 'type of data field',
                field: 'data',
                value: 123,
                expectedMessage: 'Parameter should be a string',
            },
            {
                title: 'min length of data field',
                field: 'data',
                value: 'a'.repeat(SchemasV1.MaterialRequest.properties.data.minLength - 1),
                expectedMessage: 'Minimum material data length is: 10',
            },
            {
                title: 'max length of data field',
                field: 'data',
                value: 'a'.repeat(SchemasV1.MaterialRequest.properties.data.maxLength + 1),
                expectedMessage: 'Maximum material data length is: 1000',
            },
            {
                title: 'correct course id',
                field: 'courseId',
                value: -1,
                expectedMessage: 'Unable to find course record(s)',
            },
        ];

        validationTestCases.forEach((test) => {
            it(`should validate ${test.title}`, async () => {
                const material = TestData.getMaterial();
                material.body[test.field] = test.value;

                const result = await MaterialRoute.postMaterial(material);
                expect(result.status).toBe(400);

                const error = result.body.errors[0];
                expect(error.location).toBe('body');
                expect(error.msg).toBe(test.expectedMessage);
                expect(error.param).toBe(test.field);
                expect(error.value).toBe(test.value);
            });
        });
    });

    describe('PUT: change material', function () {
        it.todo('test');
    });

    describe('DELETE: remove material', function () {
        it.todo('test');
    });
});
