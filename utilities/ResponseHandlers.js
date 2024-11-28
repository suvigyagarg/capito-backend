export const SuccessResponseHandler = (req, res, data) => {
    if (data.status !== 200) console.log(data);
  
    const resData = {
      status: data.status || 200,
      message:
        data.message ||
        "Data sent successfully",
      result: data.data,
    };
    console.log(`Response: ${JSON.stringify(resData)}`);
    return res.status(data.status || 500).json(resData);
  };

  
  
  export const ErrorResponseHandler = (req, res, error) => {
    console.log(error);
    logger("error", error.message);
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message:
        error.message ||
        "We have encountered an error while processing your request. Please try again later.",
      result: error,
    });
  };
  

