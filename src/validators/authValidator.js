import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.empty': 'Họ tên là bắt buộc',
        'string.min': 'Họ tên phải có ít nhất 2 ký tự',
        'string.max': 'Họ tên không được vượt quá 50 ký tự',
        'any.required': 'Họ tên là bắt buộc',
    }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email là bắt buộc',
            'string.email': 'Email không đúng định dạng',
            'any.required': 'Email là bắt buộc',
        }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Mật khẩu là bắt buộc',
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Mật khẩu là bắt buộc',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'string.empty': 'Vui lòng xác nhận mật khẩu',
        'any.only': 'Mật khẩu xác nhận không khớp',
        'any.required': 'Vui lòng xác nhận mật khẩu',
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email là bắt buộc',
            'string.email': 'Email không đúng định dạng',
            'any.required': 'Email là bắt buộc',
        }),
    password: Joi.string().min(1).required().messages({
        'string.empty': 'Mật khẩu là bắt buộc',
        'any.required': 'Mật khẩu là bắt buộc',
    }),
    remember: Joi.boolean().optional(),
});
