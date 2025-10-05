#ifndef MEDIAFILE_H
#define MEDIAFILE_H

#include <QMouseEvent>
#include <QMainWindow>
#include <QtWebEngineWidgets>
#include <QWebEnginePage>
#include <QWebEngineView>
#include<QStyleOption>
#include<QSqlDatabase>
#include <QFile>
#include <QObject>
#include<QSqlQuery>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QWebSocketServer>
#include <QWebSocket>
#include <QJsonDocument>
#include <QJsonObject>
#include<QSqlError>

QT_BEGIN_NAMESPACE
namespace Ui {
class MediaFile;
}
QT_END_NAMESPACE
class EventFilter : public QObject {
    Q_OBJECT
public:

    explicit EventFilter(QObject *parent = nullptr) : QObject(parent) {}
public:
    bool Get=true;
    signals:
    void fileUrl(const QString &filePath);
protected:
    bool isAllowedFileType(const QString &extension) {
        // 这里可以添加你允许的文件类型
        QStringList allowedExtensions = {"mp3", "mp4", "mov","wav","avi","mkv","ogg","webm"};
        return allowedExtensions.contains(extension);
    }
    bool eventFilter(QObject *obj, QEvent *event) override {
        if (event->type() == QEvent::DragEnter) {
            QDragEnterEvent *dragEnterEvent = static_cast<QDragEnterEvent*>(event);
            const QMimeData *mimeData = dragEnterEvent->mimeData();
            if (mimeData->hasUrls()) {
                QList<QUrl> urls = mimeData->urls();
                for (const QUrl &url : urls) {
                    QString filePath = url.toLocalFile();
                    QFileInfo fileInfo(filePath);
                    QString fileExtension = fileInfo.suffix().toLower();

                    if (!isAllowedFileType(fileExtension)) {
                        event->ignore();
                        return true;
                    }
                    else{
                        emit fileUrl(filePath);
                        return Get;
                    }
                }
            }

        }
        if(event->type()==QEvent::DragLeave){
            Get=true;
            fileUrl("Back");
            return Get;
        }
        return QObject::eventFilter(obj, event);
    }
};
class MediaFile : public QMainWindow
{
    Q_OBJECT

public:

    MediaFile(QWidget *parent = nullptr);
    ~MediaFile();

public slots:

private slots:
    void onNewConnection();
    void onNewConnectionV();
    void processMessage(const QString &message);
    void processVideo(const QString &message);
    void socketDisconnected();
     void VideoDisconnected();
private slots:
    void handleFileDropped(const QString &filePath);

private:
    void sendVideo(QWebSocket *socket, qint64 startPosition);
     QNetworkAccessManager *manager;
    void callDeepSeekAPI(const QString& input);
    void onReplyFinished(QNetworkReply *reply);
    void registerFileAssociation(const QString& appPath, const QString& fileExtension, const QString& description);

    void mouseMoveEvent(QMouseEvent *event);
    void mousePressEvent(QMouseEvent *event) ;
    void mouseReleaseEvent(QMouseEvent *event) ;

    enum class BorderRegion {
        TopLeft = 11,
        Top = 12,
        TopRight = 13,
        Left = 21,
        Center = 22,
        Right = 23,
        BottomLeft = 31,
        Bottom = 32,
        BottomRight = 33
    };

    // 判断鼠标所在的窗口边界区域
    BorderRegion getBorderRegion(const QPoint &pos) {
        const int frameWidth = 10;
        QRect rect = geometry();

        if (pos.x() < frameWidth && pos.y() < frameWidth) {
            return BorderRegion::TopLeft;
        } else if (pos.x() >= rect.width() - frameWidth && pos.y() < frameWidth) {
            return BorderRegion::TopRight;
        } else if (pos.x() < frameWidth && pos.y() >= rect.height() - frameWidth) {
            return BorderRegion::BottomLeft;
        } else if (pos.x() >= rect.width() - frameWidth && pos.y() >= rect.height() - frameWidth) {
            return BorderRegion::BottomRight;
        } else if (pos.y() < frameWidth) {
            return BorderRegion::Top;
        } else if (pos.y() >= rect.height() - frameWidth) {
            return BorderRegion::Bottom;
        } else if (pos.x() < frameWidth) {
            return BorderRegion::Left;
        } else if (pos.x() >= rect.width() - frameWidth) {
            return BorderRegion::Right;
        } else {
            return BorderRegion::Center;
        }
    }

    // 更新鼠标样式
    void updateCursor(BorderRegion region);

    enum DragMode {
        Resize,
        Move
    };

    bool isDragging = false;
    BorderRegion dragRegion;
    DragMode dragMode;
    QPoint lastGlobalPos;

    EventFilter *filter;
    QString url="";
    QString CurrPl;
    QString Name;
    QSqlDatabase database;

    QWebSocketServer *m_server;
    QWebSocketServer *video_server;

    QList<QWebSocket *> m_clients;
    QList<QWebSocket *> v_clients;

    QWebSocket * MAIN;
    void paintEvent(QPaintEvent *event);
    Ui::MediaFile *ui;
    bool        m_bDrag;
    QPoint      mouseStartPoint;
    QPoint      windowTopLeftPoint;
};
#endif // MEDIAFILE_H
