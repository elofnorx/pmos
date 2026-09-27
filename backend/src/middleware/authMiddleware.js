const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Önce header'dan token'ı al
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ basarili: false, mesaj: 'Erişim engellendi. Geçerli bir oturum bulunamadı (Token eksik).' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    
    // Doğrulanmış kullanıcı bilgilerini request nesnesine ekle
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ basarili: false, mesaj: 'Geçersiz veya süresi dolmuş oturum.' });
  }
};

module.exports = authMiddleware;
