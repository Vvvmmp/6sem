package P03_02

import (
	"fmt"
)

type Stats struct {
	getReq  int
	postReq int
}

func (s *Stats) PlusGet() {
	s.getReq++
}

func (s *Stats) PlusPost() {
	s.postReq++
}

func (s *Stats) GenStr() string {
	return fmt.Sprintf("Get-request count = %d, Post-request count = %d", s.getReq, s.postReq)
}
