// @ts-ignore
import { repo, sha, event, pull_request_number, branch } from 'ci-env'
import fetch from 'cross-fetch'

export const comment = (flavor: string, sandBoxId: string) => {
  const token = process.env.COMMENT_USER_TOKEN
  if (!token) {
    throw new Error('Access token required for comments on the PR')
  }

  if (repo && sha && event === 'pull_request') {
    const issueNumber = pull_request_number ? pull_request_number : branch.split('/')[2]
    commentService(flavor, issueNumber, sandBoxId, token)
  } else {
    throw new Error('Unable to detect env details, make sure it is running in CI env')
  }
}

const commentService = async (
  flavor: string,
  issueNumber: number,
  sandBoxId: string,
  token: string
) => {
  try {
    const url = `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`
    const data = {
      body: `${flavor} - https://codesandbox.io/s/${sandBoxId}`,
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
      body: JSON.stringify(data),
    })
    const status = await response.json()
    if (status) {
      console.info('commented successfully')
    }
  } catch (e) {
    console.info('error', e)
  }
}
