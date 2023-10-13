## 프로젝트명
### Cagao Chat App
<p align="center">
  <img src="https://github.com/youngwan2/kagao_chat_app/assets/107159871/7572d016-6d2c-4891-bc27-939a72ffc59e" alt="preview_back" width="550" height="500">   
</p>

## 개요
- vue.js 와 내장된 타입스크립트 기능을 기반으로 socket.io 를 활용한 채팅방 앱을 개발해보았습니다. 평소 카카오톡과 같은 채팅 앱들이 어떤 원리를 기반으로 구현이 되었는지 궁금했었고, 때 마침 수강 중이던 학원에서 이와 관련한 강의를 듣게 되면서, 배운 것을 접목해서 한 번 나만의 채팅앱을 만들어봐야 겠다는 목표를 가지고 개발하였습니다.
- 전체적으로 입장 가능한 방은 3개가 존재하며, 로그인한 유저를 구분하기 위해 입장 전에 닉네임을 입력하게 하였습니다. 이를 기반으로 상대방과 동일한 방에 접속하게 되면 실시간 채팅이 가능하도록 만들어봤습니다. 최대한 부드러운 인터랙션을 통해 사용자가 자연스러운 채팅 서비스를 이용할 수 있도록 최대한 신경썼습니다.

## 배포 URL
https://port-0-kagao-chat-app-12fhqa2blnnwlafj.sel5.cloudtype.app/

## 사용 라이브러리 및 프레임워크(기술스택)
#### 프론트엔드
- Vue3.js(옵션 API)
- typescript
- socket.io
#### 백엔드(및 개발환경)
- node.js(express)
- window10 환경의 비쥬얼 스튜디오 코드

## 주요기능
#### 방 별 채팅기능
- 자유, 회의, 기타 채팅방 중 선택하여 독립된 공간에서 사용자들과 실시간 채팅 가능토록 구현하였습니다.
#### 접속자 확인 기능
- 실시간으로 현재 채팅방에 접속한 사용자 목록을 확인할 수 있도록 기능을 구현하였습니다.

