describe('Patient Registration Test', () => {

    before(() => {
        cy.log("Resetting the database")
        cy.exec("bash scripts/resetDB.sh");
    });

    describe('Background', () => {
        it('the user login to the Outpatient Clinic', () => {
            cy.on('uncaught:exception', (err, runnable) => {
                return false;
            });
            cy.login();
        });
        
        it('the user visit the home page', () => {
            cy.visit('home');
        });
    });

    describe(' Register a patient', () => {
        it('the user clicks on the add patient icon', () => {
            cy.get('button[name=AddPatientIcon]').click();
        })
        const regData = [
            ['correct', 'successful'],
            ['wrong', 'unsuccessful']
        ]
        regData.forEach( (type) => {
            const [validity, status] = type;
            it(`the user enters ${validity} details for Andria Faiza`, () => {
                const details = {
                    correct: {
                        givenName: 'Andria',
                        middleName: 'Kumbha',
                        familyName: 'Faiza',
                        gender: 'Female',
                        address1: 'chamkar leu',
                        phone: '+211 34 567890'
                    },
                    wrong: {
                        givenName: null,
                        middleName: 'Kumbha',
                        familyName: 'Mwangi',
                        gender: 'Female',
                        address1: null,
                        phone: null
                    }
                };
                // Check for a valid validity parameter
                if (!details.hasOwnProperty(validity)) {
                    throw new Error(`Validity '${validity}' is not supported`);
                }
                const user = details[validity];

                cy.contains('Register Patient').should('not.be.disabled')

                if (user.givenName != null) {
                    cy.getByLabel('First Name').type(user.givenName, {force: true});
                }
                if (user.middleName != null) {
                    cy.getByLabel('Middle Name').type(user.middleName, {force: true});
                }
                if (user.familyName != null) {
                    cy.getByLabel('Family Name').type(user.familyName, {force: true});
                }
                if (user.gender != null) {
                    cy.contains(user.gender).click({force: true});
                }
                if (user.address != null) {
                    cy.getByLabel('Search address').type(user.address, {force: true});
                    cy.contains('Cambodia > Kampong Cham > Chamkar Leu').click();
                }
                if (user.phoneNumber != null) {
                    cy.getByLabel('Phone number (optional)').type(user.phone, {force: true});
                }
                // Click on the first day on the calendar because the calendar doesn't support manual inputs
                cy.getByLabel('Date of Birth').click({force: true});
                cy.get('.dayContainer .flatpickr-day').first().click({force: true});
            })

            it('the user clicks on the create patient button', () => {
                cy.contains('Register Patient').click()
            })

            it(`the patient registration should be ${status}`, () => {
                switch (status) {
                    case 'successful':
                        cy.contains('New Patient Created');
                        break;
                    case 'unsuccessful':
                        cy.contains('Incomplete form');
                        break;
                    default:
                        throw new Error(`Status '${status}' is not supported`);
                }
            })
        })
    })
})
