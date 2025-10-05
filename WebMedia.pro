QT       += core gui
QT       += webenginewidgets
QT       += webchannel
QT       += sql websockets
RC_FILE = Modify.rc
CONFIG += resources_big
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    main.cpp \
    mediafile.cpp

HEADERS += \
    mediafile.h

FORMS += \
    mediafile.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

DISTFILES += \
    Main/BackDrop/BluY.png \
    Main/BackDrop/Br.jpg \
    Main/BackDrop/De.jpg \
    Main/BackDrop/Default.jpg \
    Main/BackDrop/GR.png \
    Main/BackDrop/GreenB.png \
    Main/BackDrop/PinkG.png \
    Main/BackDrop/PurpleB.png \
    Main/BackDrop/RainboR.png \
    Main/BackDrop/SilverG.png \
    Main/BackDrop/UnknD.png \
    Main/BackDrop/UnknL.png \
    Main/BackDrop/YellowO.png \
    Main/HCScript.js \
    Main/HCStyle.css \
    Main/HIndex.html \
    Main/HIndexM.html \
    Main/HStyle.css \
    Main/Lyric/FullScreen.html \
    Main/Lyric/HFull.css \
    Main/Lyric/HFull.js \
    Main/Lyric/HLyric.css \
    Main/Lyric/HLyric.html \
    Main/Lyric/HLyric.js \
    Main/MyList/MyList.css \
    Main/MyList/MyList.html \
    Main/MyList/MyList.js \
    Main/Setting/Setting.css \
    Main/Setting/Setting.html \
    Main/Setting/Setting.js \
    Main/Setting/images/Chi.png \
    Main/Setting/images/Round.png \
    Main/Setting/images/Vector.png \
    Main/Setting/images/Yes.png \
    Main/Setting/images/svg (10).png \
    Main/Setting/images/svg (11).png \
    Main/Setting/images/svg (12).png \
    Main/Setting/images/svg (13).png \
    Main/Setting/images/svg (14).png \
    Main/Setting/images/svg (15).png \
    Main/Setting/images/svg (16).png \
    Main/Setting/images/svg (17).png \
    Main/Setting/images/svg (18).png \
    Main/Setting/images/svg (19).png \
    Main/Setting/images/svg (2).png \
    Main/Setting/images/svg (20).png \
    Main/Setting/images/svg (21).png \
    Main/Setting/images/svg (22).png \
    Main/Setting/images/svg (23).png \
    Main/Setting/images/svg (24).png \
    Main/Setting/images/svg (25).png \
    Main/Setting/images/svg (26).png \
    Main/Setting/images/svg (27).png \
    Main/Setting/images/svg (3).png \
    Main/Setting/images/svg (4).png \
    Main/Setting/images/svg (5).png \
    Main/Setting/images/svg (6).png \
    Main/Setting/images/svg (7).png \
    Main/Setting/images/svg (8).png \
    Main/Setting/images/svg (9).png \
    Main/jsmediatags.min.js

RESOURCES += \
    Nyqrc.qrc
