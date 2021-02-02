# tanggoodev

## functions

### key download

functions/key.json download from console service account key

### function example
```javascript
exports.함수명 = functions.옵션값.onCreate();
exports.함수명 = functions.옵션값.onDelete();
```

### setting
```bash
firebase functions:config:set admin.email=your email admin.db_url=your firebaseURL admin.region=asia-northeast3 admin.bucket_url=tanggoodev.appspot.com

firebase deploy --only functions or functions:배포할 함수명

```

### check config

```bash
firebase functions:config:get 
```

### moment 등록
```bash
yarn add moment
```






