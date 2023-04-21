import "./App.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function App() {
  //validação
  // Esse transform no campo "nome" torma a primeira letra maiuscula, processo de capitalização
  const createUserSchema = z
    .object({
      name: z
        .string()
        .nonempty("campo obrigátorio")
        .transform((name) => {
          return name
            .trim()
            .split(" ")
            .map((word) => {
              return word[0].toUpperCase().concat(word.substring(1));
            })
            .join(" ");
        }),
      email: z
        .string()
        .nonempty("O e-mail é obrigatório")
        .email("Digite um e-mail válido"),
      password: z
        .string()
        .nonempty("A senha é obrigatório")
        .min(8, "A senha deve ter no minimo 8 caracteres"),
      confirmPassword: z
        .string()
        .nonempty("Confirme sua senha")
        .min(8, "A senha deve ter no minimo 8 caracteres"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não conicidem",
      path: ["confirmPassword"],
    });

  //o refine pode ser usado em um campo isolado, fazendo uma validação que não existe previamente no zod

  type CreateUserFormData = z.infer<typeof createUserSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const createUser = (data: CreateUserFormData) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(createUser)}>
        <div className="div">
          <label htmlFor="name">Name:</label>
          <input type="text" {...register("name")} />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div className="div">
          <label htmlFor="email">Email:</label>
          <input type="text" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div className="div">
          <label htmlFor="password">Senha:</label>
          <input type="text" {...register("password")} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div className="div">
          <label htmlFor="confirmPassword">Confirm senha:</label>
          <input type="text" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <span>{errors.confirmPassword.message}</span>
          )}
        </div>
        <button type="submit">enviar</button>
      </form>
    </div>
  );
}

export default App;
