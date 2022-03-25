import React from 'react';
import ReactWebcam from 'react-webcam';
import fetch from 'node-fetch';

import {
  Row,
  Col,
  Button,
  Upload,
  Space,
  List,
  Slider,
  Typography,
  Image
} from 'antd';

import {FileAddFilled,CameraFilled,CheckCircleFilled,CloseCircleFilled} from '@ant-design/icons';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'
const { Title, Paragraph, Text, Link } = Typography;

import { photoSanitizer } from 'lib/media-controller';

export default class ImageTab extends React.Component {
  constructor(props) {
    super(props);
    // console.log('ImageTab props=', props);

    this.state = {
      cameraEnabled: true,
      image: null,
      fileURI: '',
      loading:false,
      crop: {
        x: 0,
        y: 0
      },
      rotation: 0,
      zoom: 1,
      croppedAreaPixels: null,
      croppedImage: null,
      userMedia:null
    }
  }

  photoOptions = {
    types: {
      value: [
        'image/jpeg', 'image/png'
      ],
      label: '.jpg, .jpeg, .png'
    },
    size: {
      value: 2 * 1024 * 1024,
      label: '2 MB'
    }
  }

  cameraConstraints = {
    width: {
      min: 640,
      ideal: 1920
    }, //     width: { min: 640, ideal: 1280, max: 1920 },
    height: {
      min: 480,
      ideal: 1080
    } //     height: { min: 480, ideal: 720, max: 1080 }
  }
  styles = {
    cropContainer: {
      position: 'relative',
      width: '100%',
      height: 400,
      background: '#000'
    },
    cropButton: {
      flexShrink: 0,
      marginLeft: 16
    },
    controls: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch'

    },
    sliderLabel: {},
    slider: {
      padding: '22px 0px',
      marginLeft: 32,
      border:'2px solid black',
      '&:hover': {
        background:'#ffb978'
      }
    },
  }

  imageRulesList = [
    {
      title: <Title level={4} style={{display: 'block', margin:'0 auto'}}>Image rules</Title>,
      description: <>
      <Space direction={'horizontal'} align="center">
        <Space direction={'vertical'}><Image src="/images/front-facing.jpg" preview={false} style={{width:'75px', height:'75px',borderRadius:'50%',margin:'0 auto', display:'block'}} /><CheckCircleFilled style={{fontSize:'20px',color:'green',margin:'0 auto',display:'block'}} /></Space>
        <Space direction={'vertical'}><Image src="/images/not-front-facing.jpg" preview={false} style={{width:'75px', height:'75px',borderRadius:'50%',margin:'0 auto', display:'block'}} /><CloseCircleFilled  style={{fontSize:'20px',color:'red',margin:'0 auto',display:'block'}} /></Space> <br />
        <Space direction={'vertical'}><Image src="/images/glasses.jpg" preview={false} style={{width:'75px', height:'75px',borderRadius:'50%',margin:'0 auto', display:'block'}} /><CheckCircleFilled style={{fontSize:'20px',color:'green',margin:'0 auto',display:'block'}} /></Space>
        <Space direction={'vertical'}><Image src="/images/sunglasses.jpg" preview={false} style={{width:'75px', height:'75px',borderRadius:'50%',margin:'0 auto', display:'block'}} /><CloseCircleFilled  style={{fontSize:'20px',color:'red',margin:'0 auto',display:'block'}} /></Space>
      </Space>
      </>
    }, {
      title: '',
      description: <>
      <Space direction={'horizontal'} align="center">
        <Space direction={'vertical'}><Image src="/images/hijab.jpg" preview={false} style={{width:'75px', height:'75px',borderRadius:'50%',margin:'0 auto', display:'block'}} /><CheckCircleFilled  style={{fontSize:'20px',color:'green',margin:'0 auto',display:'block'}} /></Space>
        <Space direction={'vertical'}><Image src="/images/niqab.jpg" preview={false} style={{width:'75px', height:'75px',borderRadius:'50%',margin:'0 auto', display:'block'}} /><CloseCircleFilled style={{fontSize:'20px',color:'red',margin:'0 auto',display:'block'}} /></Space>
        <Space direction={'vertical'}><Image src="/images/b&w.jpg" preview={false} style={{width:'75px', height:'75px',borderRadius:'50%',margin:'0 auto', display:'block'}} /><CloseCircleFilled style={{fontSize:'20px',color:'red',margin:'0 auto',display:'block'}} /></Space>
        <Space direction={'vertical'}><Image src="/images/mask.jpg" preview={false} style={{width:'75px', height:'75px',borderRadius:'50%',margin:'0 auto', display:'block'}} /><CloseCircleFilled  style={{fontSize:'20px',color:'red',margin:'0 auto',display:'block'}} /></Space>
      
      </Space>
      
      </>
    }, {
      title: '',
      description: ''
    },
  ]

  setCrop = (crop) => {
    console.log(crop);
    this.setState({crop})
  };
  setRotation = (rotation) => {
    console.log(rotation)
    this.setState({rotation})
  };
  setZoom = (zoom) => {
    console.log(zoom)
    this.setState({zoom})
  };
  setCroppedAreaPixels = (croppedAreaPixels) => {
    console.log(croppedAreaPixels)
    this.setState({croppedAreaPixels})
  };
  setCroppedImage = (croppedImage) => this.setState({croppedImage});

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setCroppedAreaPixels(croppedAreaPixels)
  }

  showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(this.state.image, this.state.croppedAreaPixels, this.state.rotation)
      console.log('donee', {croppedImage})
      let buffer = this.urlB64ToUint8Array(croppedImage.split(',')[1]);
      console.log(buffer)
      this.setCroppedImage(croppedImage)
      this.setState({picture: buffer})
    } catch (e) {
      console.error(e)
    }
  }

  onClose = () => {
    this.setCroppedImage(null)
  }

  enableCamera = () => {
    console.log(this.camera);
    this.setState({cameraEnabled: true});
  }

  urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++ i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
  draggerProps = {
    name: 'file',
    multiple: false,
    accept: this.photoOptions.types.label,
    onChange: ({file}) => {
      console.log('onChange file=', file);

      let blob = new Blob([file.originFileObj], {type: file.type});
      let imageURL = window.URL.createObjectURL(blob);
      console.log(blob)
      blob.arrayBuffer().then((arrayBuffer) => {
        this.setState({picture: arrayBuffer, image: imageURL, cameraEnabled: false});
      });

      console.log('onChange imageURL=', imageURL);

    },
    onDrop(event) {
      console.log('Dropped files', event.dataTransfer.files);
    }
  }
  uploadPicture = () => {
    this.setState({ loading: true });

    let { picture } = this.state;
    let buffer = Buffer.from(picture);

    photoSanitizer(buffer).then((URI) => {
      console.log('Image URI=', URI);
      this.setState({fileURI: URI,loading:false});
      this.props.stateHandler({imageURI: URI});

      this.props.next();

    }).catch(error => { // Handle errors
      console.log('Image upload error=', error);

      this.setState({
        picture: false,
        // cameraEnabled: true?
      });
    });

  }

  takePicture = () => {
    console.log(this.camera);
    let picture = this.camera.getScreenshot();
    let buffer = this.urlB64ToUint8Array(picture.split(',')[1]);
    console.log('Picture b64=', picture);
    let blob = new Blob([buffer], {type: "buffer"});
    console.log(blob)
    let imageURL = window.URL.createObjectURL(blob);
    console.log(imageURL)
    // this.uploadPicture(picture); // we shouldn't upload every time a picture is taken, but at the end/when user selects it as final image

    // this.props.stateHandler({ picture }, 'ImageTab'); // proof props method can be called (save form status)
    // send picture as props and dont use image state?

    this.setState({picture: buffer, image: imageURL, cameraEnabled: false});
  }

  retakePicture = () => {
    this.setState({
      picture: null,
      image: '',
      cameraEnabled: true,
      croppedImage: null,
      croppedAreaPixels: null,
      zoom: 1,
      crop: {
        x: 0,
        y: 0
      },
      rotation: 0
    })
  }

  onUserMedia = (mediaStream) => {
    console.log('User media detected', mediaStream);
    // this.camera.video.webkitRequestFullscreen();
    // this.screen.webkitRequestFullscreen();
  }

  onUserMediaError(error) {
    console.error('User media error', error);
  }


  render() {
    return (
      <>
        
        
      {
      this.state.cameraEnabled ? (
        <>
        <Row>
          <Space direction="vertical"
            size={1}>
            <Title level={2}>Smile for the camera!</Title>
            <Paragraph style={{color:'black'}}>
              Take out any masks, sunglasses or anything that could block your face and look straight at the camera.
            </Paragraph>
          </Space>
        </Row>
        <div className="video-inner-container"
          ref={
            (screen) => {
              this.screen = screen;
            }
        }>
          <div className="video-overlay">Text inside video!</div>
          <ReactWebcam style={
              {width: "100%"}
            }
            ref={
              (camera) => {
                this.camera = camera;
              }
            }
            mirrored={false}
            screenshotFormat={"image/jpeg"}
            screenshotQuality={1}
            forceScreenshotSourceSize
            videoConstraints={
              this.cameraConstraints
            }
            onCanPlayThrough={
              () => false
            }
            onClick={
              (event) => event.preventDefault()
            }
            onUserMedia={
              this.onUserMedia
            }
            onUserMediaError={
              this.onUserMediaError
          }>
            <div>TEST</div>
          </ReactWebcam>
          
        <div className="buttons-camera">
        <Button onClick={this.takePicture} shape='round' style={{display:'block', margin:'20px auto', background:"#ffb978", color:'black', fontWeight:'bold', border:'none',width:'max-content',height:'100%'}}><CameraFilled /><br />Take picture</Button>
          </div>  
        </div>
        <Space direction={'vertical'} size={1} style={{margin:'0 auto',display: 'block'}}>
        <Upload.Dragger {...this.draggerProps} style={{width: '25%', height: '100%', backgroundColor:'#ffb978', fontWeight:'bold', display:'block',margin:'0 auto', border:'none', borderRadius: '10px',marginTop:'15px'}}>
          <FileAddFilled/>

          <p className="ant-upload-text">
            Upload image
          </p>
          
        </Upload.Dragger>
        </Space>
        

      </>
      ) : null
    }
      {
      this.state.image && this.state.picture && !this.state.croppedImage && (
        <>
        <Row>
          <Space direction="vertical"
            size={1}>
            <Title level={2}>Crop your image!</Title>
            <Paragraph style={{color:'black'}}>
              Make sure your face is centered and not rotated.
            </Paragraph>
          </Space>
        </Row>
          <div style={
            this.styles.cropContainer
          }>
            <Cropper image={
                this.state.image
              }
              crop={
                this.state.crop
              }
              rotation={
                this.state.rotation
              }
              zoom={
                this.state.zoom
              }
              aspect={1}
              cropShape={"round"}
              onCropChange={
                this.setCrop
              }
              onRotationChange={
                this.setRotation
              }
              onCropComplete={
                this.onCropComplete
              }
              onZoomChange={
                this.setZoom
              }/>
          </div>
          <div style={
            this.styles.controls
          }>
            <div style={
              this.styles.sliderContainer
            }>

              Zoom

              <Slider value={
                  this.state.zoom
                }
                styles={this.styles.slider}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={
                  (zoom) => this.setZoom(zoom)
                }/>
            </div>
            <div style={
              this.styles.sliderContainer
            }>

              Rotation

              <Slider value={
                  this.state.rotation
                }
                style={{color:'black'}}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"

                onChange={
                  (rotation) => this.setRotation(rotation)
                }/>
            </div>
            <Button onClick={
                this.showCroppedImage
              }
              styles={this.styles.button}
              variant="contained"
              color="primary"
              shape='round' style={{display:'block', margin:'0 auto', backgroundColor:"#000",color:'white', border:'none',fontWeight:'bold'}}>
              Show Result
            </Button>
          </div>
        </>
      )
    }
      {
      this.state.croppedImage ? (
        <div style={
          {textAlign: "center"}
        }>
          <Space direction="vertical">
            <Title level={2}>Verify your photo!</Title>
            <Paragraph>Make sure <Text strong>your facial features are visible</Text> and <Text strong>not covered under heavy make up, masks or other coverings.</Text> You also must be looking straight at the camera.</Paragraph>
          
          <Row wrap={false}>
                  <Image preview={false} style={{width: "300px",height:'auto',borderRadius:'50%', border:'1px solid black'}}
                    src={this.state.croppedImage}
                    alt="Crop result"
                  />
                  
                  <List style={{width: "100%"}}
                        itemLayout="horizontal"
                        dataSource={this.imageRulesList}
                        renderItem={
                          (item) => (
                            <List.Item>
                            <List.Item.Meta title={item.title}
                                            description={item.description}
                            />
                            </List.Item>
                                    )
                    }/>
                    </Row>
      </Space>
          
          
          <Space direction="vertical">
                    
        <Button type='primary' disabled={this.state.croppedImage == null} shape='round' style={{display:'block', margin:'0 auto', backgroundColor:"#ffb978",fontWeight:'bold', border:'none'}} onClick={this.uploadPicture} loading={this.state.loading}>It's looking great!</Button>
        
        
        <Button type='primary' shape='round' style={{display:'block', margin:'0 auto', backgroundColor:"#95a5a6", border:'none',fontWeight:'bold'}} onClick={this.retakePicture}>No, let&apos;s take another picture</Button>
        
        </Space>
          

        </div>
      ) : null
    } 

    
        </>
    );
    
  }
}
