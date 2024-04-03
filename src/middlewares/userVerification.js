export const checkUserRole = (roles) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && roles.includes(req.user.role)) {
            return next();
        } else {
            return res.status(403).json({ message: "Acceso no autorizado." })
        }
    }
}