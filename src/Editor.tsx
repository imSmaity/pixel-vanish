import { Box, Button, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { IInputImage } from './types'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined'
import Api from './Api'

const Editor = () => {
  const [inputImage, setInputImage] = useState<IInputImage | null>(null)
  const [outputImage, setOutputImage] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)

  const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const file = e.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        // setBase64Image(base64String);
        const data = { fileName: file.name, base64String }

        Api.removeImageBackground(data)
          .then((res: any) => {
            const resBase64String = res.base64Image
            setFileType(file.type)
            setInputImage(data)

            setOutputImage(resBase64String)
          })
          .catch((error) => {
            console.log(error)
          })
      }

      reader.readAsDataURL(file)
    }
  }

  const handleReUpload = () => {
    setInputImage(null)
    setFileType(null)
    setOutputImage(null)
  }

  const handleDownload = () => {
    if (!outputImage && !fileType) return
    const byteCharacters = atob(String(outputImage))
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: String(fileType) })

    // Create a download link
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = String('bg_removed_' + inputImage?.fileName)

    // Append the link to the body and click it to trigger the download
    document.body.appendChild(downloadLink)
    downloadLink.click()

    // Remove the link from the body
    document.body.removeChild(downloadLink)
  }

  return (
    <Box>
      {!outputImage ? (
        <Box
          sx={{
            paddingTop: '15%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '28px', paddingBottom: '30px' }}>
              Upload image to remove the background
            </Typography>
          </Box>

          <Button
            variant="contained"
            component="label"
            disableElevation
            sx={{
              backgroundColor: '#0696FF',
              color: '#ffffff',
              textTransform: 'none',
              width: '15rem',
              padding: '12px',
              fontSize: '18px',
              borderRadius: '30px',
            }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageInput}
            />
          </Button>
        </Box>
      ) : null}
      {inputImage && outputImage ? (
        <Box
          sx={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            paddingTop: '5%',
          }}
        >
          <Box>
            <img
              src={String(inputImage.base64String)}
              alt="Input"
              style={{
                maxWidth: '40rem',
                maxHeight: '30rem',
                border: '2px solid #bbbbbb',
                borderRadius: '8px',
              }}
            />
            <Typography sx={{ textAlign: 'center', pt: 2 }}>
              Original
            </Typography>
          </Box>
          <Box>
            <img
              src={`data:${fileType};base64, ${outputImage}`}
              alt="Output"
              style={{
                maxWidth: '40rem',
                maxHeight: '30rem',
                border: '2px solid #bbbbbb',
                borderRadius: '8px',
              }}
            />
            <Box
              sx={{
                pt: 2,
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <DeleteOutlinedIcon onClick={handleReUpload} color="primary" />
              <ArrowCircleDownOutlinedIcon
                onClick={handleDownload}
                color="primary"
              />
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

export default Editor
