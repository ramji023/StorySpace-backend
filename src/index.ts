import server from "./app";
import connect from "./db/connection";


connect().then(() => {
    const port = process.env.PORT || 5001;
    server.listen(port, () => {
        console.log(`server is listening at ${port}`);
    })
}).catch(error => console.log("something is wrong",error))



