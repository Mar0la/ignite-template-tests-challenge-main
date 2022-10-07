import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe("Create a new user", () =>{
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () =>{
    const user:ICreateUserDTO = {
      name: "User Test",
      email: 'user@hotmail.com.br',
      password: '1234'
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.email,
    })

    const userCreated = await usersRepositoryInMemory.findByEmail(
      user.email
    );

    expect(userCreated).toHaveProperty('id')

  });

  it("should not be able to create a new user if the user already exists", async ()=>{
    expect(async()=>{
      const user = {
        name: "User Test",
        email: 'user@hotmail.com.br',
        password: '1234'
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })

    }).rejects.toBeInstanceOf(AppError)
  })

});
