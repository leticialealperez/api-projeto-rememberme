import express, {NextFunction, Request, Response} from 'express'
import 'dotenv/config'
import cors from 'cors';

const app = express();

const host = process.env.HOST
const port = process.env.PORT

app.use(express.json());
app.use(cors());

app.listen(port, ()=>{
    console.log(`>>> Started server on ${host}:${port}`);
})

class User{
    public idUser: number;
    public userName: string;
    public messages: Array<Messages> = [];

    constructor(idUser: number, userName: string){
        this.idUser = idUser;
        this.userName = userName;
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
app.post("/user", (req: Request, res: Response) =>{
    let { userName } = req.body;
    
    let userFound: User | undefined = users.find(
        (user) => user.userName == userName
    );

    if(userFound){
        res.status(400).send("Usuário já cadastrado!");
    
    }else {
        idUser++;
        const userCreate: User = new User(idUser, userName);
        users.push(userCreate);
        

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
app.get("/user/:idUser", (req: Request, res: Response) =>{
    const idFound: number = Number(req.params.idUser);

    let userFound: User | undefined = users.find(
        (user) => user.idUser == idFound
    );

    if(userFound){
        
        res.status(200).json(userFound);
    }else {

        res.status(404).send("Usuário não encontrado!");
    }
    
})

//CREATE MESSAGE...
app.post("/user/:userName/messages", (req: Request, res: Response) =>{
    let userName = req.params.userName;
    let title = req.body.title;
    let description = req.body.description;
    
    let indexFound = users.findIndex((user) => user.userName == userName);

    if(indexFound > -1){
        if(users[indexFound].messages){
            idMessage = users[indexFound].messages.length + 1; 
        }else{
            idMessage = 1;
        }
        const messageCreate: Messages = new Messages (idMessage, title, description);
        users[indexFound].messages.push(messageCreate);
        res.status(201).json(messageCreate);
    
    }else{
        res.status(404).send("Usuário informado não existe!");
    }
             
})


//READ ALL MESSAGES FOR USER NAME...
app.get("/user/:userName/messages", (req: Request, res: Response) =>{
    let userFound = req.params.userName;
    
    let indexUserFound = users.findIndex((user) => user.userName == userFound);
    
    if(indexUserFound > -1) {
        res.status(201).send(users[indexUserFound].messages);
        
    }else{
        res.status(404).send("Usuário não encontrado!");
    } 
})

//READ FOR ID MESSAGE...
app.get("/user/:userName/messages/:idMessage", (req: Request, res: Response) =>{
    const idMessageFound: number = Number(req.params.idMessage);
    const userName = req.params.userName;

    let userFound = users.find(
        (user) => user.userName == userName
    );
    
    if(userFound){
        let messageFound = userFound.messages.find(
            (messages) => messages.idMessages == idMessageFound
        );

        if(messageFound){
            res.status(201).json(messageFound);
        
        }else{
            res.status(404).send("Mensagem não encontrada!");
        }
    }else{
        res.status(404).send("Usuário não encontrado!");
    }
      
})

//UPDATE MESSAGE FOR EACH USER...
app.put("/user/:userName/messages/:idMessage", (req: Request, res: Response) =>{
    const idMessageFound: number = Number(req.params.idMessage);
    const userName = req.params.userName;
    
    const title = String(req.body.title);
    const description = String(req.body.description);
    
    let indexUserFound = users.findIndex((user) => user.userName == userName);
    
    if(indexUserFound > -1){
        let indexMessageFound = users[indexUserFound].messages.findIndex((message) => message.idMessages == idMessageFound);
        
        if(indexMessageFound > -1){
            
            if(title !== "undefined") users[indexUserFound].messages[indexMessageFound].title = title;
            if(description !== "undefined") users[indexUserFound].messages[indexMessageFound].description = description;

            res.status(200).json(users[indexUserFound].messages[indexMessageFound]);
        
        }else{
            res.status(404).send("Mensagem não encontrada!");
        }
    
    }else{
        res.status(404).send("Usuário não encontrado!");
    }
   
})

//DELETE MESSAGE FOR EACH USER...
app.delete("/user/:userName/messages/:idMessage", (req: Request, res: Response) =>{
    const idMessageFound: number = Number(req.params.idMessage);
    const userName = req.params.userName;

    let indexUserFound = users.findIndex((user) => user.userName == userName);

    if(indexUserFound > -1){
        let indexMessageFound = users[indexUserFound].messages.findIndex((message) => message.idMessages == idMessageFound);
        
        if(indexMessageFound > -1){
            res.status(200).json(users[indexUserFound].messages.splice(indexMessageFound, 1));
        
        }else{
            res.status(404).send("Mensagem não encontrada!");
        }
    
    }else{
        res.status(404).send("Usuário não encontrado!");
    }
    
})
