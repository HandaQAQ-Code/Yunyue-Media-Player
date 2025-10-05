#include "mediafile.h"
#include "ui_mediafile.h"

#include <QPropertyAnimation>
#include <QWebEngineProfile>

#include <QFileDialog>

#include <windows.h>
bool isWindowsDarkModeEnabled() {
    QSettings settings("HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize", QSettings::NativeFormat);

    int appsUseLightTheme = settings.value("AppsUseLightTheme", 1).toInt();
    return appsUseLightTheme == 0;
}

MediaFile::MediaFile(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MediaFile)
{
    ui->setupUi(this);
    this->setAcceptDrops(true);

    ui->MainUI->setContentsMargins(4,4,4,4);
    ui->web->setContextMenuPolicy(Qt::NoContextMenu);

    manager = new QNetworkAccessManager(this);
    connect(manager, &QNetworkAccessManager::finished, this, &MediaFile::onReplyFinished);

    qputenv("QTWEBENGINE_CHROMIUM_FLAGS", "--single-process --allow-insecure-localhost");

    setWindowFlags(Qt::FramelessWindowHint);    //隐藏标题栏（无边框）
    setAttribute(Qt::WA_StyledBackground);      //启用样式背景绘制
    setAttribute(Qt::WA_TranslucentBackground); //背景透明


    ui->web->setFocus();
    ui->web->page()->setBackgroundColor(Qt::transparent);
    ui->web->settings()->setAttribute(QWebEngineSettings::LocalContentCanAccessRemoteUrls, true);


    QWebEngineSettings *setting = ui->web->settings();
    setting->setAttribute(QWebEngineSettings::WebGLEnabled, true);
    setting->setAttribute(QWebEngineSettings::PluginsEnabled, true);
    setting->setAttribute(QWebEngineSettings::XSSAuditingEnabled, false);
    setting->setAttribute(QWebEngineSettings::AllowRunningInsecureContent, true);
    setting->setAttribute(QWebEngineSettings::ScrollAnimatorEnabled, true);
    setting->setAttribute(QWebEngineSettings::AllowWindowActivationFromJavaScript, true);
    setWindowIcon(QIcon(":/Logo/Logo.ico"));

    QSettings settings("Yunyue", "MVPlayer");

    if(settings.value("Theme")=="3"){
        if(isWindowsDarkModeEnabled()){
            ui->web->load(QUrl("qrc:/Data/DarkMode/HIndexM.html"));
        }
        else{
            ui->web->load(QUrl("qrc:/Data/LightMode/HIndexM.html"));
        }
    }
    if(settings.value("Theme")=="2"){
        ui->web->load(QUrl("qrc:/Data/LightMode/HIndexM.html"));
    }
    if(settings.value("Theme")=="1"){
        ui->web->load(QUrl("qrc:/Data/DarkMode/HIndexM.html"));
    }
    filter = new EventFilter(this);
    connect(filter, &EventFilter::fileUrl, this, &MediaFile::handleFileDropped);

    ui->web->installEventFilter(filter);




    ui->web->page()->settings()->setAttribute(QWebEngineSettings::ShowScrollBars,false);


    QString databaseFilePath = "MediaPlay.db";
    if (QFile::exists(databaseFilePath)) {
        qDebug() << "Database file exists.";
    } else {
        settings.setValue("Welcome", "1");
        settings.setValue("History", "1");
        settings.setValue("Logs", "1");
        settings.setValue("NetWorkProxy/IP", "");
        settings.setValue("NetWorkProxy/Port", "");
        settings.setValue("GPUBoost", 1);
        settings.setValue("Theme", "1");//1 Light,2 Dark,3 Follow;

        settings.setValue("CustomBG", "0");
        settings.setValue("CustomBG", "1");
        settings.setValue("CustomBG", "2");

        settings.setValue("Volume", "1");
        settings.setValue("VolumeBalance", "0");
        settings.setValue("VolumeEffect", "0");
        settings.setValue("VolumeLeft", "0.5");
        settings.setValue("VolumeRight", "0.5");

        settings.setValue("QuickPause", "Space");
        settings.setValue("QuickVolumeU", "ARROWUP");
        settings.setValue("QuickVolumeD", "ARROWDOWN");
        settings.setValue("QuickForward", "ARROWRIGHT");
        settings.setValue("QuickBacks", "ARROWLEFT");
        ui->web->load(QUrl("qrc:/Data/DarkMode/HIndexM.html"));
    }
    if (QSqlDatabase::contains("qt_sql_default_connection"))
    {
        database = QSqlDatabase::database("qt_sql_default_connection");
    }
    else
    {
        database = QSqlDatabase::addDatabase("QSQLITE");
        database.setDatabaseName("MediaPlay.db");
        database.setUserName("HowYouLikeThat");
        database.setPassword("AHaHaHa");

    }
    if (!database.open())
    {
        qDebug() << "Error: Failed to connect database." ;
    }
    else
    {   QSqlQuery sqlQuery;
        QString createSql = QString("SELECT * FROM USERINFO");
        sqlQuery.prepare(createSql);
        sqlQuery.exec();
        if(!sqlQuery.next()){
            settings.setValue("Welcome", "1");
            settings.setValue("History", "1");
            settings.setValue("Logs", "1");
            settings.setValue("NetWorkProxy/IP", "");
            settings.setValue("NetWorkProxy/Port", "");
            settings.setValue("GPUBoost", 1);
            settings.setValue("Theme", "1");//1 Light,2 Dark,3 Follow;

            settings.setValue("CustomBG", "0");
            settings.setValue("CustomBG", "1");
            settings.setValue("CustomBG", "2");

            settings.setValue("Volume", "1");
            settings.setValue("VolumeBalance", "0");
            settings.setValue("VolumeEffect", "0");
            settings.setValue("VolumeLeft", "0.5");
            settings.setValue("VolumeRight", "0.5");

            settings.setValue("QuickPause", "Space");
            settings.setValue("QuickVolumeU", "ARROWUP");
            settings.setValue("QuickVolumeD", "ARROWDOWN");
            settings.setValue("QuickForward", "ARROWRIGHT");
            settings.setValue("QuickBacks", "ARROWLEFT");
            ui->web->load(QUrl("qrc:/Data/DarkMode/Welcom/Welcome.html"));

            // 构建创建数据库的sql语句字符串
            QString createSql = QString("CREATE TABLE MyMusic(Name TEXT UNIQUE,DisName TEXT,Singer TEXT,Album TEXT,URL TEXT UNIQUE,Times TEXT,Tags TEXT,PLAYED TEXT,Pic TEXT,Lyric TEXT);");
            QString createSql2 = QString("CREATE TABLE MyVideo(Name TEXT UNIQUE,DisName TEXT,URL TEXT UNIQUE,Times TEXT,Tags TEXT,PLAYED TEXT,Pic TEXT);");
            QString createSql3 = QString("CREATE TABLE MyList(Name TEXT UNIQUE,Type TEXT,Size TEXT,DateC TEXT,PLAYED TEXT);");
            QString createSql8 = QString("CREATE TABLE USERINFO(Name TEXT,HEADER TEXT);");
            sqlQuery.prepare(createSql);
            sqlQuery.exec();
            sqlQuery.prepare(createSql2);
            sqlQuery.exec();
            sqlQuery.prepare(createSql3);
            sqlQuery.exec();
            sqlQuery.prepare(createSql8);
            sqlQuery.exec();

            QString createSql4 = QString("INSERT INTO MyList VALUES('%1' ,'%2',0,'',0);").arg("历史记录","V");
            QString createSql5 = QString("INSERT INTO MyList VALUES('%1' ,'%2',0,'',0);").arg("播放历史","M");
            QString createSql6 = QString("INSERT INTO MyList VALUES('%1' ,'%2',0,'',0);").arg("喜欢的视频","V");
            QString createSql7 = QString("INSERT INTO MyList VALUES('%1' ,'%2',0,'',0);").arg("喜欢的音乐","M");
            sqlQuery.prepare(createSql4);
            sqlQuery.exec();
            sqlQuery.prepare(createSql5);
            sqlQuery.exec();
            sqlQuery.prepare(createSql6);
            sqlQuery.exec();
            sqlQuery.prepare(createSql7);
            sqlQuery.exec();
            qDebug() << "table does not exist";
        }


    }

    m_server = new QWebSocketServer("Qt WS Server", QWebSocketServer::NonSecureMode, this);
    video_server = new QWebSocketServer("Qt WS Server", QWebSocketServer::NonSecureMode, this);
    if (video_server->listen(QHostAddress::Any, 9006)) {
        connect(video_server, &QWebSocketServer::newConnection, this, &MediaFile::onNewConnectionV);
        qDebug() << "Server listening on port" << 9006;
    }
    if (m_server->listen(QHostAddress::Any, 9005)) {
        connect(m_server, &QWebSocketServer::newConnection, this, &MediaFile::onNewConnection);
        qDebug() << "Server listening on port" << 9005;
    }
}



void MediaFile::handleFileDropped(const QString &filePath) {

    // 在这里处理接收到的文件路径
    if(filePath=="Back"){
        foreach (QWebSocket *i,m_clients)
        {
            i->sendTextMessage("Backto");
        }
        return;
    }
    url=filePath;
    foreach (QWebSocket *i,m_clients)
    {
        i->sendTextMessage("Coming");
    }
    filter->Get=false;
}



//窗口移动
void MediaFile::mousePressEvent(QMouseEvent *event)
{


    ui->MainUI->setContentsMargins(6,6,6,6);
    ui->MainUI->setStyleSheet("background-color: rgba(114, 114, 114, 200);border-radius:10px;");
    BorderRegion region = getBorderRegion(event->pos());
    if (region == BorderRegion::Top || region == BorderRegion::TopLeft || region == BorderRegion::Left) {
        isDragging = true;
        dragMode = DragMode::Move;
        lastGlobalPos = event->globalPos();
    } else if (region != BorderRegion::Center) {
        isDragging = true;
        dragMode = DragMode::Resize;
        foreach (QWebSocket *i,m_clients)
        {
            i->sendTextMessage("Justify");
        }
        dragRegion = region;
        lastGlobalPos = event->globalPos();
    }
}


void MediaFile::mouseMoveEvent(QMouseEvent *event)
{  BorderRegion region = getBorderRegion(event->pos());
    updateCursor(region);

    if (isDragging) {
        QPoint globalPos = event->globalPos();
        QPoint diff = globalPos - lastGlobalPos;
        QRect newRect = geometry();

        if (dragMode == DragMode::Resize) {

            switch (dragRegion) {
            case BorderRegion::TopRight:
                newRect.setTopRight(newRect.topRight() + QPoint(diff.x(), 0));
                break;
            case BorderRegion::Right:
                newRect.setRight(newRect.right() + diff.x());
                break;
            case BorderRegion::BottomLeft:
                newRect.setBottomLeft(newRect.bottomLeft() + QPoint(0, diff.y()));
                break;
            case BorderRegion::Bottom:
                newRect.setBottom(newRect.bottom() + diff.y());
                break;
            case BorderRegion::BottomRight:
                newRect.setBottomRight(newRect.bottomRight() + diff);
                break;
            default:
                break;
            }
        } else if (dragMode == DragMode::Move) {
            newRect.moveTopLeft(newRect.topLeft() + diff);
        }

        setGeometry(newRect);
        lastGlobalPos = globalPos;
    }
}
// 鼠标释放事件处理
void MediaFile::mouseReleaseEvent(QMouseEvent *event) {
    isDragging = false;
    ui->MainUI->setContentsMargins(4,4,4,4);
    ui->MainUI->setStyleSheet("background-color:rgba(114, 114, 114, 100);border-radius:10px;");
    foreach (QWebSocket *i,m_clients)
    {
        i->sendTextMessage("FinishJ");
    }
    setCursor(Qt::ArrowCursor);
}
// 更新鼠标样式
void MediaFile::updateCursor(BorderRegion region) {
    switch (region) {
    case BorderRegion::TopRight:
        setCursor(Qt::SizeBDiagCursor);
        break;
    case BorderRegion::Right:
        setCursor(Qt::SizeHorCursor);
        break;
    case BorderRegion::BottomLeft:
        setCursor(Qt::SizeFDiagCursor);
        break;
    case BorderRegion::Bottom:
        setCursor(Qt::SizeVerCursor);
        break;
    case BorderRegion::BottomRight:
        setCursor(Qt::SizeFDiagCursor);
        break;
    case BorderRegion::TopLeft:
    case BorderRegion::Top:
    case BorderRegion::Left:
        setCursor(Qt::SizeAllCursor);
        break;
    default:
        setCursor(Qt::ArrowCursor);
        break;
    }
}

MediaFile::~MediaFile()
{
    delete ui;
}




void MediaFile::paintEvent(QPaintEvent *event)
{
}
void MediaFile::onNewConnection() {

    QWebSocket *socket = m_server->nextPendingConnection();

    connect(socket, &QWebSocket::textMessageReceived, this, &MediaFile::processMessage);
    connect(socket, &QWebSocket::disconnected, this, &MediaFile::socketDisconnected);

    m_clients << socket;
    qDebug()<<socket;

}
void MediaFile::onNewConnectionV() {

    QWebSocket *socket = video_server->nextPendingConnection();

    connect(socket, &QWebSocket::textMessageReceived, this, &MediaFile::processVideo);
    connect(socket, &QWebSocket::disconnected, this, &MediaFile::VideoDisconnected);
    qDebug()<<"Connected";
    v_clients << socket;

}
void MediaFile::processVideo(const QString &message) {
    //Video
    qDebug()<<message;
    QJsonParseError error;
    QJsonDocument doc = QJsonDocument::fromJson(message.toUtf8(), &error);

    if (error.error != QJsonParseError::NoError) {
        qWarning() << "JSON解析失败:" << error.errorString();
        return;
    }

    QJsonObject root = doc.object();
    QString action = root["action"].toString();

    if (action == "PlayVideo") {
        qDebug()<<"Trans";

        QString name = root["name"].toString();
        QSqlQuery query;
        query.exec(QString("SELECT * FROM MyVideo WHERE Name='%1'").arg(name));
        QJsonArray  Detail;
        QString URL;
        while (query.next()) {
            URL=query.value("URL").toString();
            if(URL.isEmpty()){
                foreach (QWebSocket *i,v_clients)
                {
                    QJsonDocument doc(Detail);
                    i->sendTextMessage("VideoDis");
                }
                return;
            }
            foreach (QWebSocket *i,v_clients)
            {
                i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
            }
            QFile videoFile(URL);
            QFileInfo videoInfo(URL);
            QJsonObject Info;
            Info.insert("action","Transition");

            if(videoInfo.size()>1000000000){
                foreach (QWebSocket *i,v_clients)
                {
                    QJsonDocument doc(Detail);
                    i->sendTextMessage("VideoOverSize");
                    qDebug()<<"VideoOverSize";

                }
                return;
            }
            if (videoFile.open(QIODevice::ReadOnly)) {
                foreach (QWebSocket *i,v_clients)
                {
                    i->sendBinaryMessage(videoFile.readAll());
                }

                videoFile.close();
            }
            else{
                foreach (QWebSocket *i,v_clients)
                {
                    QJsonDocument doc(Detail);
                    i->sendTextMessage("VideoDis");
                }
                return;
            }
            videoFile.close();

        }




    }


}



void MediaFile::processMessage(const QString &message) {

    if(message=="Min"){this->showMinimized();}
    if(message=="Close"){this->close();}
    if(message=="Middle"){
        this->showFullScreen();
        ui->MainUI->setStyleSheet("background-color:rgba(0, 0, 0, 255);border-radius:0px;");
        ui->MainUI->setContentsMargins(0,0,0,0);
    }

    if(message=="Small"){
        this->showNormal();
        ui->MainUI->setStyleSheet("background-color:rgba(114, 114, 114, 100);border-radius:10px;");
        ui->MainUI->setContentsMargins(4,4,4,4);
    }
    if(message=="ConnectF"){


    }
    QSettings settingc("Yunyue", "MVPlayer");
    if(message=="Settings"){
        QJsonObject Setting;
        QSettings settings("Yunyue", "MVPlayer");
        QStringList keys = settings.allKeys();
        Setting["action"]="Setting";

        for (const QString &key : keys) {
            Setting[key] = settings.value(key).toString();
        }

        QSqlQuery sql;
        QString createSql = QString("SELECT * FROM USERINFO");
        sql.prepare(createSql);
        sql.exec();
        QString Name,Cover;
        while(sql.next()){
            Name=sql.value("Name").toString();
            Cover=sql.value("HEADER").toString();
        }
        Setting["Name"]=Name;
        Setting["Avatar"]=Cover;
        QJsonDocument jsonDoc(Setting);
        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage(jsonDoc.toJson(QJsonDocument::Compact));
        }

        return;
    }
    if(message=="SoundBalance"){
        settingc.setValue("VolumeBalance",abs(settingc.value("VolumeBalance").toInt()-1));

    }
    if(message=="ShowCur"){ this->setCursor(Qt::ArrowCursor);  }
    if(message == "HideCur"){this->setCursor(Qt::BlankCursor);qDebug()<<"Hide";}
    if(message=="V0"){
        settingc.setValue("VolumeEffect",0);
    }
    if(message=="V1"){
        settingc.setValue("VolumeEffect",1);
    }
    if(message=="V2"){
        settingc.setValue("VolumeEffect",2);
    }
    if(message=="V3"){
        settingc.setValue("VolumeEffect",3);
    }

    if(message=="light"){
        settingc.setValue("Theme","1");

        ui->web->load(QUrl("qrc:/Data/LightMode/HIndexM.html"));


    }
    if(message=="dark"){
        ui->web->load(QUrl("qrc:/Data/DarkMode/HIndexM.html"));

        settingc.setValue("Theme","2");
    }
    if (message == "Recommand"){
        QSqlQuery sqlQuery;
        QString All=QString("SELECT * FROM MyMusic WHERE PLAYED = (SELECT MAX(CAST(PLAYED AS INTEGER)) FROM MyMusic)");
        QString All2=QString("SELECT * FROM MyVideo WHERE PLAYED = (SELECT MAX(CAST(PLAYED AS INTEGER)) FROM MyVideo)");
        bool chooseFirst = QRandomGenerator::global()->bounded(2) == 0;
        QString queryToExecute = chooseFirst ? All : All2;
        QJsonObject Song;
        if (sqlQuery.exec(queryToExecute)) {
            if (sqlQuery.next()) {
                do {
                    Song.insert("action","RecommandB");
                    Song.insert("musicName",sqlQuery.value("DisName").toString());
                    Song.insert("url",sqlQuery.value("Name").toString());
                    Song.insert("author",sqlQuery.value("Singer").toString());
                    Song.insert("CoverPicture",sqlQuery.value("Pic").toString());
                } while (sqlQuery.next());
            }
        } else {
            queryToExecute = chooseFirst ? All2 : All;
            if (sqlQuery.exec(queryToExecute)) {
                if (sqlQuery.next()) {
                    do {
                        Song.insert("action","RecommandB");
                        Song.insert("musicName",sqlQuery.value("DisName").toString());
                        Song.insert("url",sqlQuery.value("Name").toString());
                        Song.insert("author",sqlQuery.value("Singer").toString());
                        Song.insert("CoverPicture",sqlQuery.value("Pic").toString());
                    } while (sqlQuery.next());
                }
            }
        }


        foreach (QWebSocket *i,m_clients)
        {
            QJsonDocument doc(Song);
            if(Song.empty()){
                i->sendTextMessage("NoneRec");
            }
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }

    if(message=="follow"){
        settingc.setValue("Theme","3");

        if(isWindowsDarkModeEnabled()){
            ui->web->load(QUrl("qrc:/Data/DarkMode/HIndexM.html"));
        }
        else{
            ui->web->load(QUrl("qrc:/Data/LightMode/HIndexM.html"));
        }

    }

    if(message=="BG0"){settingc.setValue("CustomBG", "0");}
    if(message=="BG1"){settingc.setValue("CustomBG", "1");}
    if(message=="BG2"){settingc.setValue("CustomBG", "2");}

    if(message=="HardWare"){
        settingc.setValue("GPUBoost",abs(settingc.value("GPUBoost").toInt()-1));
    }
    if(message=="log"){
        settingc.setValue("Logs",abs(settingc.value("Logs").toInt()-1));
    }
    if(message=="History"){
        settingc.setValue("History",abs(settingc.value("History").toInt()-1));
    }


    QJsonParseError error;
    QJsonDocument doc = QJsonDocument::fromJson(message.toUtf8(), &error);
    if (error.error != QJsonParseError::NoError) {
        qWarning() << "JSON解析失败:" << error.errorString();
        return;
    }

    QJsonObject root = doc.object();
    QString action = root["action"].toString();

    if (action == "VolumeLeft") {
        settingc.setValue("VolumeLeft",root["data"].toString());

        return;
    }

    if (action == "Volume") {
        settingc.setValue("Volume",root["volume"].toString());

        return;
    }

    if (action =="QuickUpdate"){
        QStringList Good=root["List"].toString().split("|");

        settingc.setValue("QuickPause", Good[0]);
        settingc.setValue("QuickVolumeU", Good[1]);
        settingc.setValue("QuickVolumeD", Good[2]);
        settingc.setValue("QuickForward", Good[3]);
        settingc.setValue("QuickBacks", Good[4]);

    }

    if(action=="UserInfo"){
        QSqlQuery sql;
        QString createSql = QString("INSERT INTO USERINFO VALUES('%1','%2')").arg(root["Name"].toString(),root["Avatar"].toString());

        sql.prepare(createSql);
        sql.exec();
        ui->web->load(QUrl("qrc:/Data/DarkMode/HIndexM.html"));
    }

    if (action == "WriteMetaM") {
        QJsonObject user = root["Meta"].toObject();
        QString name = user["name"].toString();

        QString singer = user["singer"].toString();
        QString album = user["album"].toString();
        QString duration = user["duration"].toString();
        QString tags = user["tags"].toString();
        QString pic = user["pic"].toString();
        QSqlQuery sqlQuery;

        QString GUID=user["Guid"].toString();
        if(GUID.isEmpty()){
            return;
        }
        QString Insert = QString("INSERT INTO MyMusic VALUES ('%1','%2','%3','%4','%5','%6','%7','%8','%9',' ') ON CONFLICT(URL) DO UPDATE SET  PLAYED = PLAYED + 1").arg(GUID,name,singer,album,url,duration,tags,"1",pic);
        sqlQuery.prepare(Insert);
        sqlQuery.exec();
        QString All=QString("SELECT DateC FROM  MyList  DateC WHERE Name='播放历史'");
        sqlQuery.prepare(All);
        sqlQuery.exec();
        QString s;
        while(sqlQuery.next()){
            s=sqlQuery.value("DateC").toString();
        }
        QStringList g=s.split("|");
        if(g.contains(GUID)){
            return;
        }
        QString Update = QString("UPDATE MyList SET  DateC=DateC||'%1|',Size=Size+1 WHERE Name='播放历史'").arg(GUID);

        sqlQuery.prepare(Update);
        sqlQuery.exec();
        qDebug()<<Update;
        database.commit();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("Updated");
            qDebug()<<"Updated";}
    }
    if (action == "WriteMetaV") {

        QJsonObject user = root["Meta"].toObject();
        QString name = user["name"].toString();
        QString duration = user["duration"].toString();
        QString tags = user["tags"].toString();
        QString pic = user["pic"].toString();
        QString GUID=user["Guid"].toString();
        QSqlQuery sqlQuery;

        if(GUID.isEmpty()){
            return;
        }
        // 构建创建数据库的sql语句字符串
        QString Insert2 = QString("INSERT INTO MyVideo VALUES ('%1','%2','%3','%4','%5','%6','%7') ON CONFLICT(URL) DO UPDATE SET  PLAYED = PLAYED + 1").arg(GUID,name,url,duration,tags,"1",pic);
        qDebug()<<Insert2;
        sqlQuery.prepare(Insert2);
        sqlQuery.exec();


        QString All=QString("SELECT DateC FROM  MyList  DateC WHERE Name='历史记录'");
        sqlQuery.prepare(All);
        sqlQuery.exec();
        QString s;
        while(sqlQuery.next()){
            s=sqlQuery.value("DateC").toString();
        }
        QStringList g=s.split("|");
        if(g.contains(GUID)){
            return;
        }

        QString Update2 = QString("UPDATE MyList SET  DateC=DateC||'%1|',Size=Size+1 WHERE Name='历史记录'").arg(GUID);
        sqlQuery.prepare(Update2);
        sqlQuery.exec();

        database.commit();

        foreach (QWebSocket *i,m_clients)
        {
            i->sendTextMessage("Updated");
            qDebug()<<"Updated";}
    }

    if (action == "GetMusicList") {
        QSqlQuery query;
        query.exec("SELECT * FROM MyMusic");
        QJsonArray  Detail;
        while (query.next()) {
            QJsonObject Song;
            Song.insert("action","MusicList");
            Song.insert("name",query.value("DisName").toString());
            Song.insert("artist",query.value("Singer").toString());
            Song.insert("duration",query.value("Times").toString());
            QStringList as=query.value("Tags").toString().split("|");
            Song.insert("tags",QJsonArray::fromStringList(as));
            Song.insert("img",query.value("Pic").toString());
            Song.insert("album",query.value("Album").toString());
            Song.insert("url",query.value("Name").toString());
            Song.insert("Lyric",query.value("Lyric").toString());
            QString URL=query.value("URL").toString();
            QFile audioFile(URL);
            if (!audioFile.open(QIODevice::ReadOnly)) {
                QSqlQuery Delt;
                QString g=QString("DELETE FROM MyMusic WHERE Name='%1'").arg(query.value("Name").toString());
                Delt.prepare(g);
                Delt.exec();
                continue;
            }
            audioFile.close();
            Detail.append(Song);
        }

        foreach (QWebSocket *i,m_clients)
        {
            QJsonDocument doc(Detail);
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }
    if (action == "GetVideoList") {
        QSqlQuery query;
        query.exec("SELECT * FROM MyVideo");
        QJsonArray  Detail;
        while (query.next()) {
            QJsonObject Song;
            Song.insert("action","VideoList");
            Song.insert("name",query.value("DisName").toString());
            Song.insert("duration",query.value("Times").toString());

            QStringList as=query.value("Tags").toString().split("|");
            Song.insert("url",query.value("Name").toString());
            QString URL=query.value("URL").toString();
            QFile audioFile(URL);
            if (!audioFile.open(QIODevice::ReadOnly)) {
                QSqlQuery Delt;
                QString g=QString("DELETE FROM MyVideo WHERE Name='%1'").arg(query.value("Name").toString());
                Delt.prepare(g);
                Delt.exec();
                continue;
            }
            Song.insert("tags",QJsonArray::fromStringList(as));
            Song.insert("img",query.value("Pic").toString());
            Detail.append(Song);
        }
        foreach (QWebSocket *i,m_clients)
        {
            QJsonDocument doc(Detail);
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }
    if (action == "GetVideoLists") {
        QSqlQuery query;
        query.exec("SELECT * FROM MyList WHERE Type='V' ");
        QJsonArray  playlist;
        int toto=1;
        while (query.next()) {
            if(settingc.value("History")==0){
                if(query.value("Name").toString()=="历史记录"){
                    continue;
                }
            }
            QJsonObject Video;
            Video.insert("action","VideoLists");
            Video.insert("id",toto);
            Video.insert("name",query.value("Name").toString());
            Video.insert("songCount",query.value("Size").toString());
            QStringList as=query.value("DateC").toString().split("|");
            QJsonArray songs;
            QString asU;
            int Size=0;
            for(auto i: as){
                QSqlQuery query2;
                QString Each=QString("SELECT * FROM MyVideo WHERE Name='%1'").arg(i);

                query2.prepare(Each);
                query2.exec();
                int id=1;
                if (query2.next()) {
                    asU=asU+query2.value("Name").toString()+"|";
                    Size++;
                    do {
                        QJsonObject song;
                        song.insert("id",id);
                        song.insert("title",query2.value("DisName").toString());
                        song.insert("duration",query2.value("Times").toString());

                        QStringList ass=query2.value("Tags").toString().split(".");
                        song.insert("tags",QJsonArray::fromStringList(ass));
                        song.insert("url",query2.value("Name").toString());
                        song.insert("cover",query2.value("Pic").toString());
                        songs.append(song);
                        id++;
                    }while (query2.next());
                }
            }
            QSqlQuery query3;
            QString Each=QString("UPDATE MyList SET  DateC='%1',Size='%2' WHERE Name='%3'").arg(asU,QString::number(Size),query.value("name").toString());
            query3.prepare(Each);
            query3.exec();
            Video.insert("songs",songs);
            playlist.append(Video);

            toto++;
        }
        foreach (QWebSocket *i,m_clients)
        {
            QJsonDocument doc(playlist);
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }
    if (action == "GetMusicLists") {
        QSqlQuery query;
        query.exec("SELECT * FROM MyList WHERE Type='M' ");
        QJsonArray  playlist;
        int toto=1;
        while (query.next()) {
            QJsonObject Music;
            Music.insert("action","MusicLists");
            Music.insert("id",toto);
            Music.insert("name",query.value("name").toString());
            Music.insert("songCount",query.value("Size").toString());
            QStringList as=query.value("DateC").toString().split("|");
            QString asU;
            QJsonArray songs;
            int Size=0;
            for(auto i: as){
                QSqlQuery query2;
                QString Each=QString("SELECT * FROM MyMusic WHERE Name='%1'").arg(i);
                query2.prepare(Each);
                query2.exec();
                int id=1;
                if (query2.next()) {

                    asU=asU+query2.value("Name").toString()+"|";
                    Size++;
                    do {
                        QJsonObject song;
                        song.insert("id",id);
                        song.insert("title",query2.value("DisName").toString());
                        song.insert("duration",query2.value("Times").toString());
                        song.insert("artist",query2.value("Singer").toString());
                        QStringList ass=query2.value("Tags").toString().split(".");
                        song.insert("tags",QJsonArray::fromStringList(ass));
                        song.insert("url",query2.value("Name").toString());
                        song.insert("cover",query2.value("Pic").toString());
                        songs.append(song);
                        id++;
                    }while (query2.next());
                }

            }
            QSqlQuery query3;
            QString Each=QString("UPDATE MyList SET  DateC='%1',Size='%2' WHERE Name='%3'").arg(asU,QString::number(Size),query.value("name").toString());
            query3.prepare(Each);
            query3.exec();
            Music.insert("songs",songs);
            playlist.append(Music);
            toto++;
        }
        foreach (QWebSocket *i,m_clients)
        {
            QJsonDocument doc(playlist);
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }
    if (action == "GetFavLists") {
        QSqlQuery query;
        query.exec("SELECT * FROM MyList WHERE Name='喜欢的音乐' ");
        QVariantMap map;
        map["action"]="FavLists";
        int toto=1;
        while (query.next()) {
            QStringList as=query.value("DateC").toString().split("|");
            QJsonArray music;
            for(auto i: as){
                QSqlQuery query2;
                QString Each=QString("SELECT * FROM MyMusic WHERE Name='%1'").arg(i);
                query2.prepare(Each);
                query2.exec();
                int id=1;
                while (query2.next()) {
                    QJsonObject song;
                    song.insert("id",id);
                    song.insert("title",query2.value("DisName").toString());
                    song.insert("duration",query2.value("Times").toString());
                    song.insert("artist",query2.value("Singer").toString());
                    QStringList ass=query2.value("Tags").toString().split(".");
                    song.insert("tags",QJsonArray::fromStringList(ass));
                    song.insert("cover",query2.value("Pic").toString());
                    song.insert("url",query2.value("Name").toString());
                    music.append(song);
                    id++;
                }
            }
            map["music"] = music;
            qDebug()<<music;
            toto++;
        }

        QSqlQuery query3;
        query3.exec("SELECT * FROM MyList WHERE Name='喜欢的视频' ");
        while (query3.next()) {
            QStringList as=query3.value("DateC").toString().split("|");
            QJsonArray video;
            for(auto i: as){
                QSqlQuery query4;
                QString Each=QString("SELECT * FROM MyVideo WHERE Name='%1'").arg(i);
                query4.prepare(Each);
                query4.exec();
                int id=1;
                while (query4.next()) {
                    QJsonObject song;
                    song.insert("id",id);
                    song.insert("title",query4.value("DisName").toString());
                    song.insert("duration",query4.value("Times").toString());
                    QStringList ass=query4.value("Tags").toString().split(".");
                    song.insert("tags",QJsonArray::fromStringList(ass));
                    song.insert("cover",query4.value("Pic").toString());
                    song.insert("url",query4.value("Name").toString());
                    video.append(song);
                    id++;
                }
            }

            map["video"] = video;
        }

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage(QJsonDocument::fromVariant(map).toJson(QJsonDocument::Compact));
        }
    }


    //Music
    if(action == "Lyric"){
        QString textToSave = root["Lyric"].toString();
        qDebug()<<root["Name"].toString();
        QString filePath = QFileDialog::getSaveFileName(this, "保存歌词文件",root["Name"].toString()+"-lyric" , "文本文件 (*.txt)");
        QSqlQuery Send;
        Send.exec(QString("UPDATE MyMusic SET Lyric='%1' WHERE Name='%2'").arg(filePath,root["Name"].toString()));
        qDebug()<<QString("UPDATE MyMusic SET Lyric='%1' WHERE Name='%2'").arg(filePath,root["Name"].toString());
        if (!filePath.isEmpty()) {
            QFile file(filePath);
            if (file.open(QIODevice::WriteOnly | QIODevice::Text)) {
                QTextStream out(&file);
                out << textToSave;
                file.close();
                qDebug() << "文件保存成功。";
            } else {
                qDebug() << "无法打开文件进行写入: " << file.errorString();
            }
        }

    }
    if (action == "PlayMusic") {
        QString name = root["name"].toString();
        qDebug()<<name<<"查询 ";
        QSqlQuery query;
        query.exec(QString("SELECT * FROM MyMusic WHERE Name='%1'").arg(name));
        QJsonArray  Detail;
        QString URL,LURL;
        if (name=="") {
            foreach (QWebSocket *i,m_clients)
            {
                i->sendTextMessage("MusicDis");
            }
            return;
        }
        while (query.next()) {
            QJsonObject Song;
            Song.insert("action","PlayMusicB");
            Song.insert("name",query.value("DisName").toString());
            Song.insert("artist",query.value("Singer").toString());
            Song.insert("album",query.value("Album").toString());
            Song.insert("duration",query.value("Times").toString());
            QStringList as=query.value("Tags").toString().split(".");
            Song.insert("img",query.value("Pic").toString());
            URL=query.value("URL").toString();
            LURL=query.value("Lyric").toString();
            qDebug()<<URL;
            QFile audioFile(URL);
            if (!audioFile.open(QIODevice::ReadOnly)) {
                foreach (QWebSocket *i,m_clients)
                {
                    i->sendTextMessage("MusicDis");
                }
                return;
            }
            QFile LyricS(LURL);
            QTextStream in(&LyricS);
            if (!LyricS.open(QIODevice::ReadOnly)) {

            }
            QString content = in.readAll();
            LyricS.close();


            QByteArray audioData = audioFile.readAll();
            audioFile.close();
            Song.insert("Lyrics",content);
            Song.insert("tags",QJsonArray::fromStringList(as));
            Detail.append(Song);
            foreach (QWebSocket *i,m_clients)
            {
                QJsonDocument doc(Detail);

                i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
                i->sendBinaryMessage(audioData);

            }
        }

    }
    if (action == "UpdateMeta"){

        QJsonObject user = root["Meta"].toObject();
        QString prename =user["prename"].toString();
        QString name = user["name"].toString();
        QString singer = user["singer"].toString();
        QString album = user["album"].toString();
        QString tga;
        for (const auto& value : user["tags"].toArray()) {
            tga+=value.toString().replace(QRegularExpression("×"),"|");
        }
        QString pic = user["pic"].toString();
        QString Lyrics = user["filePath"].toString();
        qDebug()<<Lyrics;
        if(album=="404"){
            QSqlQuery sqlQuery;

            QString a=QString("UPDATE MyMusic SET DisName='%1',Singer='%2', Pic='%3'  WHERE Name='%5'").arg(name,singer,pic,prename);
            sqlQuery.prepare(a);
            sqlQuery.exec();
            qDebug()<<a;
        }
        else{
            QSqlQuery sqlQuery;

            QString a=QString("UPDATE MyMusic SET DisName='%1',Singer='%2',Album='%3', Tags='%4', Pic='%5' ,Lyric='%6' WHERE Name='%7'").arg(name,singer,album,tga,pic,Lyrics,prename);
            sqlQuery.prepare(a);
            sqlQuery.exec();

        }
        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("UpdatedMusic");
        }
    }
    if (action == "RemoveM"){
        QString name = root["name"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("DELETE  FROM MyMusic WHERE Name='%1'").arg(name);
        sqlQuery.prepare(a);
        sqlQuery.exec();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("UpdatedMusic");
        }
    }
    if (action == "addML"){
        QString name = root["name"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("INSERT INTO MyList VALUES('%1','M','0','','0')").arg(name);
        sqlQuery.prepare(a);
        sqlQuery.exec();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("Updated");
        }
    }
    if (action == "reML"){
        QString prename = root["prename"].toString();
        QString name = root["name"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("UPDATE MyList SET Name='%1' WHERE Name='%2'").arg(name,prename);
        sqlQuery.prepare(a);
        sqlQuery.exec();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("Updated");
        }
    }
    if (action == "PlayAllM"){
        QString list = root["List"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("SELECT * FROM MyList WHERE Name='%1'").arg(list);
        sqlQuery.prepare(a);
        sqlQuery.exec();
        QStringList ass;
        QStringList Upass,UPassFake;
        QString Up;
        int Size=0;
        while (sqlQuery.next()) {
            ass=sqlQuery.value("DateC").toString().split("|");
        }
        for(auto name : ass){
            QSqlQuery query;
            query.exec(QString("SELECT * FROM MyMusic WHERE Name='%1'").arg(name));
            QString URL,LURL;
            while (query.next()) {
                URL=query.value("URL").toString();
                QFile audioFile(URL);
                if (!audioFile.open(QIODevice::ReadOnly)) {
                    continue;
                }
                audioFile.close();
                Upass.append(name);
                UPassFake.append(query.value("DisName").toString());
                Up=Up+name+"|";
                Size++;
            }
        }
        QString a1=QString("UPDATE MyList SET DateC='%1',Size='%2' WHERE Name='播放历史'").arg(Up,QString::number(Size));
        sqlQuery.prepare(a1);
        sqlQuery.exec();

        QJsonArray Send;
        QJsonObject Header;
        Header.insert("action","MusicPL");
        Send.append(Header);
        Send.append(QJsonArray::fromStringList(Upass));
        Send.append(QJsonArray::fromStringList(UPassFake));
        foreach (QWebSocket *i,m_clients)
        {

            QJsonDocument doc(Send);
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }
    if (action == "GetMusicListsLite") {
        QSqlQuery query;
        QString name = root["name"].toString();
        query.exec("SELECT * FROM MyList WHERE Type='M' ");
        QJsonArray  playlist;
        while (query.next()) {
            QJsonObject Music;
            Music.insert("action","MusicListsL");
            Music.insert("name",query.value("name").toString());
            QString All=QString("SELECT DateC FROM  MyList DateC WHERE Name='%1'").arg(query.value("name").toString());
            QSqlQuery sqlQuery;
            sqlQuery.prepare(All);
            sqlQuery.exec();
            QString s;
            while(sqlQuery.next()){
                s=sqlQuery.value("DateC").toString();
            }
            QStringList g=s.split("|");
            if(g.contains(name)){
                Music.insert("include","1");
            }
            else{
                Music.insert("include","0");
            }
            playlist.append(Music);
        }

        foreach (QWebSocket *i,m_clients)
        {
            QJsonDocument doc(playlist);
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }
    if (action == "AddMTL") {
        QSqlQuery sqlQuery;
        QString name = root["name"].toString();
        QString List=root["List"].toString();
        QString All=QString("SELECT DateC FROM  MyList  DateC WHERE Name='%1',Type='M'").arg(List);
        sqlQuery.prepare(All);
        sqlQuery.exec();
        QString s;
        while(sqlQuery.next()){
            s=sqlQuery.value("DateC").toString();
        }
        QStringList g=s.split("|");
        if(g.contains(name)){
            return;
        }
        QString Update = QString("UPDATE MyList SET  DateC=DateC||'%1|',Size=Size+1 WHERE Name='%2'").arg(name,List);
        qDebug()<<Update<<"\n";
        sqlQuery.prepare(Update);
        sqlQuery.exec();
        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("Updated");
        }
    }
    if (action == "ReMoveL"){
        QSqlQuery sqlQuery;
        QString name = root["name"].toString();
        QString List=root["List"].toString();
        QString All=QString("SELECT DateC FROM  MyList  DateC WHERE Name='%1'").arg(List);
        sqlQuery.prepare(All);
        sqlQuery.exec();
        QString s;
        while(sqlQuery.next()){
            s=sqlQuery.value("DateC").toString();
        }

        QStringList g=s.split("|");
        QString Get;
        for(auto i:g){
            if(i==""||i==" "||i==name){
                continue;
            }
            Get+=i;
            Get+="|";
        }

        QString Update = QString("UPDATE MyList SET  DateC='%1',Size=Size-1 WHERE Name='%2'").arg(Get,List);
        sqlQuery.prepare(Update);
        sqlQuery.exec();
        qDebug()<<Update;
        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("DeletedeM");
        }
    }
    if (action == "ReMoveML"){
        QSqlQuery sqlQuery;
        QString name = root["name"].toString();
        QString All=QString("DELETE FROM  MyList  WHERE Name='%1'").arg(name);
        sqlQuery.prepare(All);
        sqlQuery.exec();
        foreach (QWebSocket *i,m_clients)
        {
            i->sendTextMessage("DeletedeM");
        }
    }


    if (action == "PlayVideo") {
        QString name = root["name"].toString();
        qDebug()<<name<<"查询 ";
        QSqlQuery query;
        query.exec(QString("SELECT * FROM MyVideo WHERE Name='%1'").arg(name));
        QJsonArray  Detail;
        QString URL,LURL;
        if (name=="") {
            foreach (QWebSocket *i,m_clients)
            {
                i->sendTextMessage("VideoDis");
            }
            return;
        }
        while (query.next()) {
            QJsonObject Song;
            Song.insert("action","PlayMusicV");
            Song.insert("name",query.value("DisName").toString());
            Song.insert("duration",query.value("Times").toString());
            QStringList as=query.value("Tags").toString().split(".");
            Song.insert("img",query.value("Pic").toString());
            Song.insert("tags",QJsonArray::fromStringList(as));
            Detail.append(Song);
            foreach (QWebSocket *i,m_clients)
            {
                QJsonDocument doc(Detail);

                i->sendTextMessage(doc.toJson(QJsonDocument::Compact));


            }
        }

    }
    if (action == "UpdateMetaV"){
        QJsonObject user = root["Meta"].toObject();
        QString prename =user["prename"].toString();
        QString name = user["name"].toString();
        QString tga;
        for (const auto& value : user["tags"].toArray()) {
            tga+=value.toString().replace(QRegularExpression("×"),"|");
        }
        QString pic = user["pic"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("UPDATE MyVideo SET DisName='%1', Tags='%2', Pic='%3' WHERE Name='%4'").arg(name,tga,pic,prename);
        sqlQuery.prepare(a);
        sqlQuery.exec();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("UpdatedVideo");
        }
    }
    if (action == "RemoveV"){
        QString name = root["name"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("DELETE  FROM MyVideo WHERE Name='%1'").arg(name);
        sqlQuery.prepare(a);
        sqlQuery.exec();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("UpdatedMusic");
        }
    }
    if (action == "addMLV"){
        QString name = root["name"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("INSERT INTO MyList VALUES('%1','V','0','','0')").arg(name);
        sqlQuery.prepare(a);
        sqlQuery.exec();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("Updated");
        }
    }
    if (action == "reMLV"){
        QString prename = root["prename"].toString();
        QString name = root["name"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("UPDATE MyList SET Name='%1' WHERE Name='%2'").arg(name,prename);
        sqlQuery.prepare(a);
        sqlQuery.exec();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("Updated");
        }
    }
    if (action == "PlayAllV"){
        QString list = root["List"].toString();
        QSqlQuery sqlQuery;
        QString a=QString("SELECT * FROM MyList WHERE Name='%1'").arg(list);
        sqlQuery.prepare(a);
        sqlQuery.exec();
        QStringList ass;
        QStringList Upass,UPassFake;
        QString Up;
        int Size=0;
        while (sqlQuery.next()) {
            ass=sqlQuery.value("DateC").toString().split("|");
        }
        for(auto name : ass){
            QSqlQuery query;
            query.exec(QString("SELECT * FROM MyVideo WHERE Name='%1'").arg(name));
            QString URL,LURL;
            while (query.next()) {
                URL=query.value("URL").toString();
                QFile audioFile(URL);
                if (!audioFile.open(QIODevice::ReadOnly)) {
                    continue;
                }
                audioFile.close();
                Upass.append(name);
                UPassFake.append(query.value("DisName").toString());
                Up=Up+name+"|";
                Size++;
            }
        }
        QString a1=QString("UPDATE MyList SET  DateC='%1',Size='%2' WHERE Name='历史记录'").arg(Up,QString::number(Size));
        sqlQuery.prepare(a1);
        sqlQuery.exec();
        QJsonArray Send;
        QJsonObject Header;
        Header.insert("action","VideoPL");
        Send.append(Header);
        Send.append(QJsonArray::fromStringList(ass));
        Send.append(QJsonArray::fromStringList(UPassFake));
        foreach (QWebSocket *i,m_clients)
        {

            QJsonDocument doc(Send);
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }
    if (action == "GetVideoListsLite") {
        QSqlQuery query;
        QString name = root["name"].toString();
        query.exec("SELECT * FROM MyList WHERE Type='V' ");
        QJsonArray  playlist;
        while (query.next()) {
            QJsonObject Music;
            Music.insert("action","MusicListsL");
            Music.insert("name",query.value("name").toString());
            QString All=QString("SELECT DateC FROM  MyList  DateC WHERE Name='%1'").arg(query.value("name").toString());
            QSqlQuery sqlQuery;
            sqlQuery.prepare(All);
            sqlQuery.exec();
            QString s;
            while(sqlQuery.next()){
                s=sqlQuery.value("DateC").toString();
            }
            QStringList g=s.split("|");
            if(g.contains(name)){
                Music.insert("include","1");
            }
            else{
                Music.insert("include","0");
            }
            playlist.append(Music);
        }
        foreach (QWebSocket *i,m_clients)
        {
            QJsonDocument doc(playlist);
            i->sendTextMessage(doc.toJson(QJsonDocument::Compact));
        }
    }

    if (action == "AddVTL") {
        QSqlQuery sqlQuery;
        QString name = root["name"].toString();
        QString List=root["List"].toString();
        QString All=QString("SELECT DateC FROM MyList  WHERE Name='%1',Type='V'").arg(List);
        sqlQuery.prepare(All);
        sqlQuery.exec();
        QString s;
        while(sqlQuery.next()){
            s=sqlQuery.value("DateC").toString();
        }
        QStringList g=s.split("|");
        if(g.contains(name)){
            return;
        }
        QString Update = QString("UPDATE MyList SET  DateC=DateC||'%1|',Size=Size+1 WHERE Name='%2'").arg(name,List);

        sqlQuery.prepare(Update);
        sqlQuery.exec();
        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("Updated");
        }
    }
    if (action == "ReMoveV"){
        QSqlQuery sqlQuery;
        QString name = root["name"].toString();
        QString List=root["List"].toString();
        QString All=QString("SELECT DateC FROM  MyList  DateC WHERE Name='%1'").arg(List);
        sqlQuery.prepare(All);
        sqlQuery.exec();
        QString s;
        while(sqlQuery.next()){
            s=sqlQuery.value("DateC").toString();
        }
        QStringList g=s.split("|");
        QString Get;
        for(auto i:g){
            if(i==""||i==" "||i==name){
                continue;
            }
            Get+=i;
            Get+="|";
        }


        QString Update = QString("UPDATE MyList SET  DateC='%1',Size=Size-1 WHERE Name='%2'").arg(Get,List);
        sqlQuery.prepare(Update);
        sqlQuery.exec();

        foreach (QWebSocket *i,m_clients)
        {

            i->sendTextMessage("DeletedeM");
        }
    }

}



void MediaFile::socketDisconnected() {
    QWebSocket *client = qobject_cast<QWebSocket *>(sender());
    if (client) {
        m_clients.removeAll(client);
        client->deleteLater();
    }
}


void MediaFile::VideoDisconnected() {
    QWebSocket *client = qobject_cast<QWebSocket *>(sender());
    if (client) {
        v_clients.removeAll(client);
        client->deleteLater();
    }
}


void MediaFile::callDeepSeekAPI(const QString& input)
{
    QNetworkRequest request;
    request.setUrl(QUrl("https://api.deepseek.com"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader("Authorization", "Bearer sk-acf0169e88d44e618445c10a080a1f01");


    QJsonObject jsonData;

    jsonData["model"] ="deepseek-chat";
    jsonData["stream"]="false";
    QJsonArray Message;
    QJsonObject role,content;
    role.insert("role","system");
    content.insert("content","You are a helpful assistant");
    Message.append(role);
    Message.append(content);
    QJsonObject role2,content2;
    role2.insert("role","user");
    content2.insert("content",input);
    Message.append(role2);
    Message.append(content2);
    jsonData["messages"]=Message;
    QJsonDocument doc(jsonData);
    QByteArray data = doc.toJson();



    QNetworkReply *reply = manager->post(request, data);
    if (!reply) {
        qDebug() << "Failed to send request";
    }
}

void MediaFile::onReplyFinished(QNetworkReply *reply)
{
    if (reply->error() == QNetworkReply::NoError) {
        QByteArray responseData = reply->readAll();
        QJsonDocument jsonResponse = QJsonDocument::fromJson(responseData);
        QJsonObject jsonObject = jsonResponse.object();
        qDebug() << "API Response:" << jsonObject;
    } else {
        qDebug() << "Error:" << reply->errorString();
    }
    reply->deleteLater();
}
