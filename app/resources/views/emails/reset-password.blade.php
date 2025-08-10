<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset Password - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-align: center;
            padding: 40px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1f2937;
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s;
        }
        .reset-button:hover {
            transform: translateY(-2px);
        }
        .alternative-link {
            background-color: #f3f4f6;
            border-radius: 6px;
            padding: 20px;
            margin: 30px 0;
            border-left: 4px solid #6b7280;
        }
        .alternative-link p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .alternative-link code {
            background-color: #e5e7eb;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 13px;
            word-break: break-all;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 0;
            font-size: 14px;
            color: #6b7280;
        }
        .security-notice {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 16px;
            margin: 20px 0;
        }
        .security-notice p {
            margin: 0;
            color: #b91c1c;
            font-size: 14px;
        }
        .expiry-info {
            background-color: #fffbeb;
            border: 1px solid #fed7aa;
            border-radius: 6px;
            padding: 16px;
            margin: 20px 0;
        }
        .expiry-info p {
            margin: 0;
            color: #d97706;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .content {
                padding: 30px 20px;
            }
            .reset-button {
                padding: 14px 24px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Reset Password</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Halo!
            </div>
            
            <div class="message">
                Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda di <strong>{{ config('app.name') }}</strong>.
            </div>
            
            <div class="button-container">
                <a href="{{ $actionUrl }}" class="reset-button">
                    Reset Password Saya
                </a>
            </div>
            
            <div class="expiry-info">
                <p><strong>⏰ Penting:</strong> Link reset password ini akan expired dalam <strong>{{ $count }} menit</strong> untuk keamanan akun Anda.</p>
            </div>
            
            <div class="alternative-link">
                <p>Jika tombol di atas tidak berfungsi, copy dan paste URL berikut ke browser Anda:</p>
                <code>{{ $actionUrl }}</code>
            </div>
            
            <div class="security-notice">
                <p><strong>🛡️ Catatan Keamanan:</strong> Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tidak akan berubah.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Email ini dikirim oleh {{ config('app.name') }}</p>
            <p>Jika Anda memiliki pertanyaan, silakan hubungi tim support kami.</p>
        </div>
    </div>
</body>
</html>