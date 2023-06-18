from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtWidgets import QFileDialog
import keras
import keras.utils as image
import numpy as np

#Модель CNN
model = keras.models.load_model('categorical.h5')

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(600, 500)
        MainWindow.setMaximumSize(QtCore.QSize(600, 500))
        MainWindow.setStyleSheet("background-color: rgb(219, 223, 238)")

        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")

        #Шапка
        self.label = QtWidgets.QLabel(self.centralwidget)
        self.label.setGeometry(QtCore.QRect(-20, 0, 631, 71))
        self.label.setStyleSheet("background-color: rgb(19, 22, 43)")
        self.label.setText("")
        self.label.setObjectName("label")

        #Логотип
        self.label_2 = QtWidgets.QLabel(self.centralwidget)
        self.label_2.setGeometry(QtCore.QRect(250, 20, 111, 41))
        self.label_2.setText("")
        self.label_2.setPixmap(QtGui.QPixmap("logo.jpg"))
        self.label_2.setObjectName("label_2")

        #Кнопка
        self.ZagrFoto = QtWidgets.QPushButton(self.centralwidget)
        self.ZagrFoto.setGeometry(QtCore.QRect(0, 450, 600, 51))
        font = QtGui.QFont()
        font.setFamily("Franklin Gothic Heavy")
        font.setPointSize(15)
        self.ZagrFoto.setFont(font)
        self.ZagrFoto.setStyleSheet("background-color: rgb(19, 22, 43);\n"
                                    "color: rgb(255, 153, 51);")
        self.ZagrFoto.setObjectName("ZagrFoto")

        #Лейбл для расположения фото
        self.upload_photo_label = QtWidgets.QLabel(self.centralwidget)
        self.upload_photo_label.setGeometry(QtCore.QRect(75, 100, 450, 300))
        self.upload_photo_label.setStyleSheet("background-color: rgb(255, 255, 255);")
        self.upload_photo_label.setObjectName("upload_photo_label")

        #Текстовое поле
        self.label_3 = QtWidgets.QLabel(self.centralwidget)
        self.label_3.setGeometry(QtCore.QRect(50, 420, 510, 20))
        self.label_3.setStyleSheet("background-color: rgb(255, 255, 255);")
        self.label_3.setObjectName("label_3")

        MainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainWindow)

        QtCore.QMetaObject.connectSlotsByName(MainWindow)
        self.ZagrFoto.clicked.connect(self.open_file_dialog)

    #Заполнение текста
    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "Анализ"))
        self.ZagrFoto.setText(_translate("MainWindow", "Загрузка фото"))
        self.label_3.setText(_translate("MainWindow", "Фото не загружено"))

    #Функция кнопки
    def open_file_dialog(self):
        options = QFileDialog.Options()
        options |= QFileDialog.ReadOnly
        file_name, _ = QFileDialog.getOpenFileName(None, "Выберите изображение", "",
                                                   "Images (*.png *.xpm *.jpg *.bmp);;All Files (*)", options=options)
        img = image.load_img(file_name, target_size=(750, 500))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = x / 255.0

        if file_name:
            self.load_image(file_name)

        #Определение класса
        predictions = model.predict(x)
        print(predictions)
        if  predictions[0][1][2]<0.5:
            self.label_3.setText('Не лес')
        else:
            if predictions[0] > predictions[1] and predictions[2]:
                self.label_3.setText('Лиственный лес')
            else:
                if predictions[1] > predictions[0] and predictions[2]:
                    self.label_3.setText('Смешанный лес')
                else:
                    self.label_3.setText('Хвойный лес')

    #Загрузка изображения
    def load_image(self, file_path):
        pixmap = QtGui.QPixmap(file_path)
        pixmap = pixmap.scaled(self.upload_photo_label.width(), self.upload_photo_label.height(),
                               QtCore.Qt.KeepAspectRatio)
        self.upload_photo_label.setPixmap(pixmap)



if __name__ == "__main__":
    import sys

    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())