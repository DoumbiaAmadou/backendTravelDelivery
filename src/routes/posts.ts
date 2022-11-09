const express = require("express");
const router = express();
import { Response , Request,NextFunction} from  'express' ; 

router.get("/", (req: Request, res: Response) => {
  res.send("posts is start ");
});
router.post("/", (req: Request, res: Response, next: NextFunction) => {});
module.exports = router;
