import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Statement Operation Get", () =>{
  beforeEach(() =>{
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory, statementsRepositoryInMemory
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory, statementsRepositoryInMemory
    );
  })

  it("should be able to statement operation",async () => {
    const user:ICreateUserDTO = {
      name: "User Test",
      email: 'user@hotmail.com.br',
      password: '1234'
    };

    const createUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    const statement:ICreateStatementDTO = {
      user_id: createUser.id as string,
      description: "testStatement",
      amount: 12000,
      type: OperationType.DEPOSIT
    }

    const createdStatement = await createStatementUseCase.execute({
      user_id: statement.user_id,
      description: statement.description,
      amount: statement.amount,
      type: statement.type
    })

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: createUser.id as string,
      statement_id: createdStatement.id as string
    })

    expect(getStatement).toHaveProperty("id");
    expect(getStatement).toHaveProperty("user_id");
  })

  it("should not be able to statement operation for user non existant", async () => {
    expect(async () =>{
      const statement:ICreateStatementDTO = {
        user_id: "user1489Not484Exits",
        description: "testStatement",
        amount: 12000,
        type: OperationType.DEPOSIT
      }

      const createdStatement = await createStatementUseCase.execute({
        user_id: statement.user_id,
        description: statement.description,
        amount: statement.amount,
        type: statement.type
      })

      await getStatementOperationUseCase.execute({
        user_id: createdStatement.user_id as string,
        statement_id: createdStatement.id as string
      })

    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to statement operation for statement non existant", async () => {
    expect(async () =>{
      const user:ICreateUserDTO = {
        name: "User Test",
        email: 'user@hotmail.com.br',
        password: '1234'
      };

      const createUser = await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })

      await getStatementOperationUseCase.execute({
        user_id: createUser.id as string,
        statement_id: "statement5484Not5559Exists"
      })


    }).rejects.toBeInstanceOf(AppError)
  })

})