import {Component} from '@angular/core';
import {Camera, CameraDirection, CameraResultType} from '@capacitor/camera';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  faceImg = "";

  constructor() {
  }

  async cameraOrLibraryPopup() {
    const permissionsStatus = await Camera.checkPermissions();
    if (permissionsStatus?.camera === 'denied' || permissionsStatus?.photos === 'denied') {
      await Camera.requestPermissions({permissions: ['camera', 'photos']})
    }

    Camera.getPhoto({
      quality: 80,
      height: 500,
      allowEditing: false,
      saveToGallery: false,
      correctOrientation: true,
      direction: CameraDirection.Front,
      resultType: CameraResultType.Base64
    }).then(async (image: any) => {
      let base64String = image?.base64String;
      const imgUrl = "data:image/jpeg;base64," + base64String;
      this.faceImg = imgUrl;
    }).catch((err: any) => {
      console.error('cameraOrLibraryPopup', err);
    });
  }

  async deletePicture() {
    this.faceImg = "";
  }


}
