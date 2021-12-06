import express, {NextFunction, Request, Response} from 'express'
import 'dotenv/config'
import cors from 'cors';

const app = express();

const port = process.env.PORT

app.use(express.json());
app.use(cors());

app.listen(port, ()=>{
    console.log(`>>> Started server on PORT ${port}`);
})

class User{
    public idUser: number;
    public userName: string;
    public password: string;
    public messages: Array<Messages> = [];

    constructor(idUser: number, userName: string, password: string){
        this.idUser = idUser;
        this.userName = userName;
        this.password = password;
    }
}

class Messages{
    public idMessages: number;
    public title: string;
    public description: string;

    constructor(id: number, title: string, description: string){
        this.idMessages = id;
        this.title = title;
        this.description = description;
    }
}

let users: Array<User> = [];
let idUser: number = 0;
let idMessage: number = 0;


//CREATE USER...
app.post("/user", (req: Request, res: Response, next: NextFunction) =>{
    let { userName, password } = req.body;
    
    let userFound: User | undefined = users.find(
        (user) => user.userName == userName
    );

    if(userFound){
        res.status(400).send("ERRO: usuário já cadastrado!");
    
    }else {
        const userCreate: User = new User(idUser, userName, password);
        users.push(userCreate);
        idUser++;

        res.status(201).json(userCreate);  
    }
     
});

//READ ALL USERS...
app.get("/user", (req: Request, res: Response) =>{
    let allUsers: any = [];
    
    users.forEach(element => {
        const { messages, ...usersfilter } = element;
        allUsers.push(usersfilter);
    });

    res.status(201).json(allUsers);
})


//READ USER...
app.get("/user/:idUser", (req: Request, res: Response, next: NextFunction) =>{
    const idFound: number = Number(req.params.idUser);

    let userFound: User | undefined = users.find(
        (user) => user.idUser == idFound
    );

    if(userFound){
        
        res.send(userFound);
    }else {

        res.send("ERRO! Usuário não encontrado!");
    }
    
})

//UPDATE USER...
app.put("/user/:idUser", (req: Request, res: Response, next: NextFunction) =>{
    const name = String(req.body.name);
    const password = String(req.body.password);
    const idFound = Number(req.params.idUser);

    let indexFound = users.findIndex((user) => user.idUser == idFound);

    if(indexFound > -1){
        if(name !== "undefined") users[indexFound].userName = name;
        if(password !== "undefined") users[indexFound].password = password;
    
        const { messages, ...userFoundFilter } = users[indexFound];
        res.status(200).send(userFoundFilter);
    
    }else{
        res.status(400).send("Erro: Usuário não encontrado!");
    }
})


//DELETE USER...
app.delete("/user/:idUser", (req: Request, res: Response, next: NextFunction) =>{
    const idFound = Number(req.params.idUser);

    let indexFound = users.findIndex((user) => user.idUser == idFound);

    if(indexFound > -1){
        res.status(200).send(users.splice(indexFound, 1));
    
    }else{
        res.status(400).send("Erro: Usuário não encontrado!");
    }
})

//CREATE MESSAGE...
app.post("/user/:idUser/messages", (req: Request, res: Response) =>{
    let idFound = Number(req.params.idUser);
    let title = String(req.body.title);
    let description = String(req.body.description);
    
    let indexFound = users.findIndex((user) => user.idUser == idFound);

    if(indexFound > -1){
        const messageCreate: Messages = new Messages (idMessage, title, description);
        users[indexFound].messages.push(messageCreate);
        idMessage++;

        res.status(201).json(messageCreate);
    
    }else{
        res.status(400).send("Erro: Usuário informado não existe!");
    }
             
})


//READ ALL MESSAGES FOR ID USER...
app.get("/user/:idUser/messages", (req: Request, res: Response, next: NextFunction) =>{
    let idUserFound = Number(req.params.idUser);
    
    let indexUserFound = users.findIndex((user) => user.idUser == idUserFound);
    
    if(indexUserFound > -1) {
        res.status(201).send(users[indexUserFound].messages);
        
    }else{
        res.status(400).send("ERRO: Usuário não encontrado!");
    } 
})

//READ FOR ID MESSAGE...
app.get("/user/:idUser/messages/:idMessage", (req: Request, res: Response, next: NextFunction) =>{
    const idMessageFound: number = Number(req.params.idMessage);
    const idUserFound = Number(req.params.idUser);

    let userFound = users.find(
        (user) => user.idUser == idUserFound
    );
    
    if(userFound){
        let messageFound = userFound.messages.find(
            (messages) => messages.idMessages == idMessageFound
        );

        if(messageFound){
            res.status(201).send(messageFound)
        
        }else{
            res.status(400).send("ERRO: Mensagem não encontrada!");
        }
    }else{
        res.status(400).send("ERRO: Usuário não encontrado!");
    }
      
})

//UPDATE MESSAGE FOR EACH USER...
app.put("/user/:idUser/messages/:idMessage", (req: Request, res: Response, next: NextFunction) =>{
    const idMessageFound: number = Number(req.params.idMessage);
    const idUserFound = Number(req.params.idUser);
    
    const title = String(req.body.title);
    const description = String(req.body.description);
    
    let indexUserFound = users.findIndex((user) => user.idUser == idUserFound);
    
    if(indexUserFound > -1){
        let indexMessageFound = users[indexUserFound].messages.findIndex((message) => message.idMessages == idMessageFound);
        
        if(indexMessageFound > -1){
            
            if(title !== "undefined") users[indexUserFound].messages[indexMessageFound].title = title;
            if(description !== "undefined") users[indexUserFound].messages[indexMessageFound].description = description;

            res.status(200).send(users[indexUserFound].messages[indexMessageFound]);
        
        }else{
            res.status(400).send("Erro: Mensagem não encontrada!");
        }
    
    }else{
        res.status(400).send("Erro: Usuário não encontrado!");
    }
   
})

//DELETE MESSAGE FOR EACH USER...
app.delete("/user/:idUser/messages/:idMessage", (req: Request, res: Response, next: NextFunction) =>{
    const idMessageFound: number = Number(req.params.idMessage);
    const idUserFound = Number(req.params.idUser);

    let indexUserFound = users.findIndex((user) => user.idUser == idUserFound);

    if(indexUserFound > -1){
        let indexMessageFound = users[indexUserFound].messages.findIndex((message) => message.idMessages == idMessageFound);
        
        if(indexMessageFound > -1){
            res.status(200).send(users[indexUserFound].messages.splice(indexMessageFound, 1));
        
        }else{
            res.status(400).send("Erro: Mensagem não encontrada!");
        }
    
    }else{
        res.status(400).send("Erro: Usuário não encontrado!");
    }
    
})
