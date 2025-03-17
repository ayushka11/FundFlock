import express from 'express';

import TransactionController from "../controllers/transaction";
import verifyToken from "../middlewares/authentication";
import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";

export default (router: express.Router) => {
    const transactionRouter = express.Router();

    transactionRouter.use(verifyToken);

    transactionRouter.post("/create", TransactionController.createTransaction);

    transactionRouter.use(errorHandlingMiddleware);

    router.use("/transaction", transactionRouter);
}