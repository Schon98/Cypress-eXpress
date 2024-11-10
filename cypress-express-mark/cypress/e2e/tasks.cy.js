/// <reference types="cypress" />


describe('tarefas', () =>{

    it('deve cadastrar uma nova tarefa', () =>{

        const taskName = 'ler um livro de Node.js'

        cy.request({
            url:'http://localhost:3333/helper/tasks',
            method: 'DELETE',
            body:{name:'ler um livro de Node.js'}
        }).then(response =>{
            expect(response.status).to.eq(204)
        })
    
        cy.visit('http://localhost:3000')

        cy.get('input[placeholder="Add a new Task"]')
            .type('ler um livro de Node.js')
        
         //button[contains(text(), "Create")] 

        cy.contains('button', 'Create').click()
        cy.contains('main div p','r um livro de Node.js').should('be.visible')
    })
    
    it('não deve permitir tarefa duplicada', () =>{

        const task = {
            name: 'Estudar Javascript',
            is_done: false 
        }

        cy.request({
            url:'http://localhost:3333/helper/tasks',
            method: 'DELETE',
            body:{name: task.name}
        }).then(response =>{
            expect(response.status).to.eq(204)
        })

        //Dado que tenho uma tarefa duplicada 
        cy.request({
             url:'http://localhost:3333/tasks',
             method: 'POST',
             body:{name: 'Estudar Javascript', is_done: false}
        }).then(response => {
            expect(response.status).to.eq(201)
        })
        //Quando faço o cadastrod essa tarefa
        
        cy.visit('http://localhost:3000')

        cy.get('input[placeholder="Add a new Task"]')
            .type(task.name)
        
        cy.contains('button', 'Create').click()

        //Então vejo que a mensagem de duplicidade
        cy.get('.swal2-html-container') 
        .should('be.visible')
        .should('have.text', 'Task already exists!')
    })
})