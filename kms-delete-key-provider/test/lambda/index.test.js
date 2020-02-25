import { handler } from '../../lambda/index';
import * as fx from 'node-fixtures';

jest.mock('../../lambda/send-response', () => ({
    sendResponse: jest.fn(),
}));

jest.mock('../../lambda/delete-key', () => ({
    deleteSecretKey: jest.fn(),
}));

const { sendResponse } = require('../../lambda/send-response');
const { deleteSecretKey } = require('../../lambda/delete-key');

describe('#handler', () => {
    beforeEach(async () => {
        sendResponse.mockReset()
        deleteSecretKey.mockReset()
    })

    describe('when request type is Create', () => {
        beforeEach(async () => {
            await handler(fx.create)
        })

        it('should send a response with a status of SUCCESS', () => {
            expect(sendResponse).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'SUCCESS' })
            )
        })
    })

    describe('when request type is Update', () => {
        beforeEach(async () => {
            await handler(fx.create)
        })

        it('should send a response with a status of SUCCESS', () => {
            expect(sendResponse).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'SUCCESS' })
            )
        })
    })

    describe('when request type is Delete', () => {
        beforeEach(async () => {
            await handler(fx.create)
        })

        it('should send a response with a status of SUCCESS', () => {
            expect(sendResponse).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'SUCCESS' })
            )
        })
    })

    describe('when request type is Delete and KMS delete fails', () => {
        beforeEach(async () => {
            deleteSecretKey.mockImplementation(() => {
                throw new Error('Some Reason')
            })
            await handler(fx.delete)
        })

        it('should send a response with a status of FAILED', () => {
            expect(sendResponse).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'FAILED' })
            )
        })
    })
})
