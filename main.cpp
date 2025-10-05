#include "mediafile.h"
#include<QJsonObject>
#include <QApplication>


#include <QFile>
#include <QTextStream>
#include <QDateTime>
#include <QDebug>

// 简单的异或加密函数
QByteArray encryptData(const QByteArray &data, const QByteArray &key) {
    QByteArray encryptedData = data;
    for (int i = 0; i < encryptedData.size(); ++i) {
        encryptedData[i] = encryptedData[i] ^ key[i % key.size()];
    }
    return encryptedData;
}

// 自定义日志处理函数
void myMessageOutput(QtMsgType type, const QMessageLogContext &context, const QString &msg)
{
    // 生成加密密钥
    QByteArray key = QCryptographicHash::hash("YunyueStudio", QCryptographicHash::Sha256);
    // 打开日志文件，以追加模式写入
    QFile file("log.txt");
    if (file.open(QIODevice::Append | QIODevice::Text)) {
        QTextStream out(&file);

        // 获取当前时间
        QDateTime currentDateTime = QDateTime::currentDateTime();
        QString timeStamp = currentDateTime.toString("yyyy-MM-dd hh:mm:ss");

        // 根据日志类型添加不同前缀
        QString logType;
        switch (type) {
        case QtDebugMsg:
            logType = "Debug";
            break;
        case QtInfoMsg:
            logType = "Info";
            break;
        case QtWarningMsg:
            logType = "Warning";
            break;
        case QtCriticalMsg:
            logType = "Critical";
            break;
        case QtFatalMsg:
            logType = "Fatal";
            break;
        }

        // 构建日志信息
        QString logMessage = QString("[%1] [%2] %3 (%4:%5, %6)\n").arg(timeStamp).arg(logType).arg(msg).arg(context.file).arg(context.line).arg(context.function);

        // 加密日志信息
        QByteArray encryptedLog = encryptData(logMessage.toUtf8(), key);

        // 写入加密后的日志信息
        out << QString::fromUtf8(encryptedLog);
        file.close();
    }
}

// 删除日志文件的函数
bool deleteLogFile() {
    QFile file("log.txt");
    if (file.exists()) {
        return file.remove();
    }
    return false;
}
//注册文件名扩展
void registerFileAssociation(const QString& appPath, const QString& fileExtension, const QString& description)
{
    QString appName = QFileInfo(appPath).fileName();
    QString progId = "MyMediaPlayer." + fileExtension.mid(1);

    // 注册 ProgID
    QSettings progIdSettings("HKEY_CURRENT_USER\\Software\\Classes\\" + progId, QSettings::NativeFormat);
    progIdSettings.setValue("", description);
    progIdSettings.setValue("DefaultIcon", appPath + ",0");

    QSettings shellSettings(progIdSettings.fileName() + "\\shell", QSettings::NativeFormat);
    QSettings openSettings(shellSettings.fileName() + "\\open", QSettings::NativeFormat);
    QSettings commandSettings(openSettings.fileName() + "\\command", QSettings::NativeFormat);
    commandSettings.setValue("", "\"" + appPath + "\" \"%1\"");

    // 注册文件扩展名
    QSettings extSettings("HKEY_CURRENT_USER\\Software\\Classes\\" + fileExtension, QSettings::NativeFormat);
    extSettings.setValue("", progId);
}

int main(int argc, char *argv[])
{

    QSettings settings("Yunyue", "MVPlayer");



    if(settings.value("GPUBoost")==1){
        QApplication::setAttribute(Qt::AA_UseOpenGLES);
    }
    else{
        QApplication::setAttribute(Qt::AA_UseSoftwareOpenGL);
    }


    QApplication a(argc, argv);


    MediaFile w;
    w.show();
    return a.exec();
}

