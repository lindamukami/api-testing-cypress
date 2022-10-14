/// <reference types ="cypress"/>
import ENDPOINTS from "../constants/endpoint";
import { NEW_USER, REGISTER, ERROR_MESSAGES, EXISTING_USER } from "../constants";

describe('USers Api', () => {
    context('GET request', () => {
        it('should assert the status code', () => {
            cy.request('GET',ENDPOINTS.users).its('status').should('eq', 200);
        });
        it('should assert the number of users', () =>{
            cy.request(ENDPOINTS.users)
            .its('body')
            .its('data')
            .should('be.an', 'array')
            .and('have.length', 6);
        });
        it('should get a single user', () =>{
            cy.request(`${ENDPOINTS.users}?id=1`).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.data.id).to.eq(EXISTING_USER.id);
                expect(res.body.data.email).to.eq(EXISTING_USER.email);
                expect(res.body.data.first_name).to.eq(EXISTING_USER.first_name);
                expect(res.body.data.last_name).to.eq(EXISTING_USER.last_name);
                expect(res.body.data.avatar).to.eq(EXISTING_USER.avatar);
            });
        });
        it('Should create a new user', () => {
            cy.request('POST', ENDPOINTS.users, NEW_USER).then((res) => {
                expect(res.status).to.eq(201);
                expect(Object.keys(res.body)).to.have.length(5);
                expect(res.body.id).to.eq(NEW_USER.id);
                expect(res.body.email).to.eq(NEW_USER.email);
                expect(res.body.firstName).to.eq(NEW_USER.firstName);
                expect(res.body.lastName).to.eq(NEW_USER.lastName);
                expect(res.body.notExistingKeyPair).to.be.undefined;

            });
        });
        it('should create a new user successfully', () => {
            cy.request('POST', ENDPOINTS.register, REGISTER.USER_WITH_EMAIL_AND_PASSWORD).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.id).to.eq(4);
                expect(res.body.token).to.eq('QpwL5tke4Pnpja7X4');
                expect(res.body.email).to.be.undefined;
                expect(res.body.password).to.be.undefined;
            });

        });
        it('should not be able to create a user with missing email', () => {
            cy.request({
                method: 'POST',
                url: ENDPOINTS.register, 
                body: REGISTER.USER_WITH_MISSING_EMAIL,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('error', ERROR_MESSAGES.MISSING_EMAIL_OR_USERNAME);
            });
        });
        it('should not be able to create user with missing password', () => {
            cy.request({
                method: 'POST',
                url: ENDPOINTS.register,
                body: REGISTER.USER_WITH_MISSING_PASSWORD,
                failOnStatusCode: false,
            }).then((res) =>{
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('error', ERROR_MESSAGES.MISSING_PASSWORD);
            });
        });

    });
});