import type { ApiDesk } from '@violet/lib/types/api'
import type { WorkId } from '@violet/lib/types/branded'
import { Fetching } from '@violet/web/src/components/organisms/Fetching'
import { useMemo } from 'react'
import type { BrowserRevision } from 'src/types/browser'
import { maincolumnHeight } from 'src/utils/constants'
import styled from 'styled-components'
import { EmptyWork } from './components/EmptyWork'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { MainColumn } from './components/MainColumn'
import { ProjectBar } from './components/ProjectBar'
import { TabBar } from './components/TabBar'
import { usePage } from './usePage'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
`
const WorksView = styled.div`
  width: 100%;
`
const WorksHeader = styled.div`
  width: 100%;
`
const WroksMain = styled.div`
  height: ${maincolumnHeight};
  overflow-y: auto;
`

const ProjectPage = () => {
  const { error, projectApiData, projects, currentProject } = usePage()

  const getDesk = (desks: ApiDesk[], openedTabId: WorkId) =>
    desks.filter((c) => (c.works.some((w) => w.id === openedTabId) ? c.id : null))[0]?.id

  const browserRevisionData = useMemo(
    () =>
      projectApiData?.revisions?.map<BrowserRevision>((p) => ({
        id: p.id,
        url: p.url,
        editions: [],
        messages:
          projectApiData.messages?.filter((message) => p.messageIds?.includes(message.id)) ?? [],
      })) ?? [],
    [projectApiData]
  )

  if (!projectApiData || !currentProject) return <Fetching error={error} />

  return (
    <Container>
      <ProjectBar projects={projects} projectId={projectApiData.projectId} />
      <LeftColumn>
        <Explorer projectApiData={projectApiData} project={currentProject} />
      </LeftColumn>
      <WorksView>
        {currentProject.openedTabId ? (
          browserRevisionData.length > 0 ? (
            <>
              <WorksHeader>
                <TabBar project={currentProject} projectApiData={projectApiData} />
              </WorksHeader>
              <WroksMain>
                <MainColumn
                  projectId={currentProject.id}
                  deskId={getDesk(projectApiData.desks, currentProject.openedTabId)}
                  workId={currentProject.openedTabId}
                  revisions={browserRevisionData}
                />
              </WroksMain>
            </>
          ) : (
            <>
              <TabBar project={currentProject} projectApiData={projectApiData} />
              <EmptyWork
                projectId={currentProject.id}
                workId={currentProject.openedTabId}
                deskId={getDesk(projectApiData.desks, currentProject.openedTabId)}
              />
            </>
          )
        ) : (
          <div>Choose work</div>
        )}
      </WorksView>
    </Container>
  )
}

export default ProjectPage
