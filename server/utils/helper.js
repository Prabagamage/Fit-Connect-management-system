
export const ERROR_RESPONSE = (res, status, message) => res.status(status).json({ message });

export const SUCCESS_RESPONSE = (res, status, data) => res.status(status).json(
    {
        data
    });