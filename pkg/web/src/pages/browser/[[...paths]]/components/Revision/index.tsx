import { acceptExtensions } from '@violet/def/constants'
import { CONTENT_TYPES } from '@violet/lib/constants/file'
import type { ApiRevision } from '@violet/lib/types/api'
import type { ProjectId, RevisionPath, WorkId } from '@violet/lib/types/branded'
import type { InfoJson } from '@violet/lib/types/files'
import { DataIcon } from '@violet/web/src/components/atoms/DataIcon'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { colors, fontSizes, mainColumnHeight } from '@violet/web/src/utils/constants'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`
const DisplayWorksFrame = styled.div`
  display: flex;
  flex-direction: column;
  height: ${mainColumnHeight};
  min-height: 100%;
  padding: 48px;
  background: ${colors.transparent};
  transition: background 0.2s, padding 0.2s;
`
const DisplayWorksViewer = styled.img`
  flex: 1;
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
  object-fit: contain;
`
const Dropper = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: ${colors.transparent};
  opacity: 0;
`
const Character = styled.div`
  height: 48px;
  font-size: ${fontSizes.large};
  color: ${colors.gray};
`
const fetcher = async (url: RevisionPath) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error()
  }
  const revisionPath = url.substring(0, url.lastIndexOf('/'))
  return res
    .json()
    .then((d: InfoJson) =>
      d.fallbackImageExts.map((ext, i) => `${revisionPath}/${i}.${ext}` as RevisionPath)
    )
}

export const Revision = (props: {
  projectId: ProjectId
  workId: WorkId
  revision: ApiRevision
  dropFile: (file: File) => void
}) => {
  const [isFile, setIsFile] = useState(false)
  const [workPath, setWorkPath] = useState<RevisionPath[]>()
  const { data, error } = useSWR(props.revision.url, fetcher)
  useEffect(() => {
    if (data !== undefined) setWorkPath(data)
  }, [data])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      props.dropFile(e.target.files[0])
    }
    setIsFile(false)
    e.target.value = ''
  }

  if (error) {
    return (
      <Container>
        <DataIcon />
        <Spacer axis="y" size={16} />
        <Character>CONVERTING...</Character>
      </Container>
    )
  }

  return (
    <Container
      onDragEnter={() => setIsFile(true)}
      onDragEnd={() => setIsFile(false)}
      onChange={onChange}
    >
      {isFile && <Dropper type="file" accept={acceptExtensions} />}
      <DisplayWorksFrame>
        {workPath?.map((p) => (
          <picture key={p}>
            <source
              type={CONTENT_TYPES.webp}
              srcSet={`${p.substring(0, p.lastIndexOf('.'))}.webp`}
            />
            <DisplayWorksViewer src={p} />
          </picture>
        ))}
      </DisplayWorksFrame>
    </Container>
  )
}
