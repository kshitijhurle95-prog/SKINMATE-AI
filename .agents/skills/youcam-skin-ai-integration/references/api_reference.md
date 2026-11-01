# YouCam Skin AI API Endpoint Reference

## India Region
* **Base URL:** `https://yce-api-01.makeupar.com`
* **Console:** `https://yce.makeupar.com/api-console/`
* **Docs:** `https://docs.makeupar.com/develop/introduction`

## Global Region
* **Base URL:** `https://yce-api-01.perfectcorp.com`
* **Console:** `https://yce.perfectcorp.com/api-console/`
* **Docs:** `https://docs.perfectcorp.com/develop/introduction`

---

## 1. File Upload Registration API
`POST /s2s/v2.0/file`

### Request Headers
```http
Authorization: Bearer <YOUCAM_API_KEY>
Content-Type: application/json
```

### Request Payload
```json
{
  "files": [
    {
      "content_type": "image/jpeg",
      "file_name": "user_selfie.jpg",
      "file_size": 524288
    }
  ]
}
```

### Response
```json
{
  "status": 200,
  "data": {
    "files": [
      {
        "content_type": "image/jpeg",
        "file_name": "user_selfie.jpg",
        "file_id": "SaGaqpDgKwFrVBgMpQMA3HY0LeqdT9/13W5TOD8/u/...",
        "requests": [
          {
            "method": "PUT",
            "url": "https://yce-us.s3-accelerate.amazonaws.com/demo/ttl30/...",
            "headers": {
              "Content-Length": "524288",
              "Content-Type": "image/jpeg"
            }
          }
        ]
      }
    ]
  }
}
```

---

## 2. S3 Binary Stream Upload
`PUT <requests[0].url>`

### Request Headers
```http
Content-Type: image/jpeg
Content-Length: 524288
```
Body: Raw image buffer / binary stream.

---

## 3. Create Skin Analysis Task
`POST /s2s/v2.0/task/skin-analysis`

### Request Payload
```json
{
  "src_file_id": "SaGaqpDgKwFrVBgMpQMA3HY0LeqdT9/13W5TOD8/u/...",
  "dst_actions": [
    "wrinkle",
    "pore",
    "texture",
    "acne",
    "spot",
    "redness",
    "moisture",
    "dark_circle_v2",
    "radiance",
    "oiliness",
    "eyebag",
    "firmness"
  ],
  "miniserver_args": {
    "enable_mask_overlay": true,
    "enable_dark_background_hd_pore": true,
    "color_dark_background_hd_pore": "3D3D3D",
    "opacity_dark_background_hd_pore": 0.4
  },
  "format": "json"
}
```

### Response
```json
{
  "status": 200,
  "data": {
    "task_id": "SaGaqpDgKwFrVBgMpQMA3HY0LeqdT9_13W5TOD8_u_GPi6NqQ3dhlmN-6ntFwhzT"
  }
}
```

---

## 4. Poll Task Status
`GET /s2s/v2.0/task/skin-analysis/<task_id>`

### Response (when status is "success")
```json
{
  "status": 200,
  "data": {
    "task_status": "success",
    "results": {
      "output": [
        {
          "type": "texture",
          "ui_score": 74,
          "raw_score": 62.4,
          "mask_urls": ["https://yce-us.s3-accelerate.amazonaws.com/demo/.../texture.jpg"]
        },
        {
          "type": "pore",
          "ui_score": 68,
          "raw_score": 55.1,
          "mask_urls": ["https://yce-us.s3-accelerate.amazonaws.com/demo/.../pore.jpg"]
        },
        {
          "type": "acne",
          "ui_score": 85,
          "raw_score": 82.0,
          "mask_urls": ["https://yce-us.s3-accelerate.amazonaws.com/demo/.../acne.jpg"]
        },
        {
          "type": "moisture",
          "ui_score": 62,
          "raw_score": 51.8
        },
        {
          "type": "oiliness",
          "ui_score": 58,
          "raw_score": 48.2
        },
        {
          "type": "dark_circle_v2",
          "ui_score": 70,
          "raw_score": 64.0
        },
        {
          "type": "redness",
          "ui_score": 88,
          "raw_score": 86.5
        }
      ]
    }
  }
}
```
