import { uploadform } from "../../controllers/uploadController.js";
import { SuccessResponseHandler, ErrorResponseHandler } from "../../utilities/ResponseHandlers.js";
import { Router } from "express";

const RouterHandler = Router();

export default () => {
    RouterHandler.post('/', async (req, res) => {
        try {
            const result = await uploadform(req, res);
            
            if (result.status >= 200 && result.status < 300) {
                SuccessResponseHandler(req, res, result);
            } else {
                ErrorResponseHandler(req, res, result);
            }
        }
        catch (error) {
            console.error('Error in image upload route:', error);
            ErrorResponseHandler(req, res, {
                status: 500,
                message: 'Internal server error'
            });
        }
    });

    return RouterHandler;
};